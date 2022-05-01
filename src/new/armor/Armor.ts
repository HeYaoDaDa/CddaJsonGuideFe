import { isEmpty, isNotEmpty } from 'src/utils';
import { getNotEmptyJsonItems } from 'src/utils/baseJsonItemMapUtil';
import { cloneObject } from 'src/utils/cloneObject';
import { h, VNode } from 'vue';
import { AsyncName, generateAsyncNames, hasAsyncName } from '../AsyncName';
import { BodyPart } from '../bodyPart/BodyPart';
import { SubBodyPart } from '../bodyPart/SubBodyPart';
import MyField from '../components/MyField.vue';
import MyText from '../components/MyText/MyText.vue';
import { Flag } from '../FlagsContant';
import {
  getArray,
  getBoolean,
  getNumber,
  getOptionalArray,
  getOptionalAsyncName,
  getOptionalNumber,
} from '../JsonUtil';
import { Material } from '../material/Material';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { ArmorMaterial } from './ArmorMaterial';
import { ArmorPortion } from './ArmorPortion';
import { ItemBase } from './ItemBase';
import MyCard from 'src/components/myComponents/MyCard.vue';
import { foreachVNode } from 'src/utils/DataUtil';

export class Armor extends SuperData<ArmorInterface> {
  constructor(value: JsonItem | undefined) {
    super(value);
    if (value) {
      if (value.type === CddaType.armor) {
        this.parseJson(value.content);
      } else if (value.content.hasOwnProperty('armor_data')) {
        this.parseJson((<Record<string, unknown>>value.content).armor_data);
      }
    }
  }

  validateValue(value: JsonItem): boolean {
    return (
      value.type === CddaType.armor ||
      value.content.hasOwnProperty('armor_data')
    );
  }

  getView(): VNode[] {
    const armor = this.data;
    const result: VNode[] = [];

    result.push(
      h(MyCard, { label: 'armor', width: '-webkit-fill-available' }, () => [
        h(
          MyField,
          { label: 'layer', isHide: () => isEmpty(armor.allLayers) },
          () => [
            h(MyText, {
              content: armor.allLayers.map((layer) => layer.value.name),
              separator: ', ',
            }),
          ]
        ),
        h(MyField, { label: 'warmth' }, () => [
          h(MyText, {
            content: armor.warmth,
          }),
        ]),
        h(MyField, { label: 'rigid' }, () =>
          h(MyText, { content: armor.rigid })
        ),
        h(MyField, { label: 'comfortable' }, () =>
          h(MyText, { content: armor.comfortable })
        ),
        h(MyField, { label: 'resist' }, () =>
          h(
            'div',
            { style: { display: 'flex' } },
            armor.armorResists?.map((armorResist) =>
              h('dl', {}, viewArmorResistInterface(armorResist))
            )
          )
        ),
      ])
    );

    return result;
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.subArmorPortions = getArray(jsonObject, 'armor', []).map(
      (armorObject) => new ArmorPortion(armorObject as object)
    );
    const covers = getOptionalArray(jsonObject, 'covers')?.map(
      (value) => new AsyncName(<string>value, CddaType.bodyPart)
    );

    data.materialThickness = getOptionalNumber(
      jsonObject,
      'material_thickness'
    );

    data.environmentalProtection = getOptionalNumber(
      jsonObject,
      'environmental_protection'
    );
    data.environmentalProtectionFilter = getOptionalNumber(
      jsonObject,
      'environmental_protection_with_filter'
    );

    data.subArmorPortions.forEach((subArmorPortion) => {
      if (data.materialThickness)
        subArmorPortion.data.avgThickness = data.materialThickness;
      if (data.environmentalProtection)
        subArmorPortion.data.environmentalProtection =
          data.environmentalProtection;
      if (data.environmentalProtectionFilter)
        subArmorPortion.data.environmentalProtectionWithFilter =
          data.environmentalProtectionFilter;
      if (covers && isNotEmpty(covers)) {
        subArmorPortion.data.coversBodyPart = covers;
      }
    });

    data.sided = getBoolean(jsonObject, 'sided', false);
    data.warmth = getNumber(jsonObject, 'warmth', 0);
    data.nonFunctional = getOptionalAsyncName(
      jsonObject,
      'non_functional',
      CddaType.item
    );
    data.weightCapacityModifier = getNumber(
      jsonObject,
      'weight_capacity_modifier',
      1
    );
    data.weightCapacityBonus = getNumber(
      jsonObject,
      'weight_capacity_bonus',
      0
    );
    data.powerArmor = getBoolean(jsonObject, 'power_armor', false);
    data.validMods = generateAsyncNames(
      getArray(jsonObject, 'valid_mods', []) as string[],
      CddaType.item
    );
  }

  public load(item: ItemBase) {
    this.inferSubArmorPortionsArmorMaterial(item);
    this.setSubArmorPotionsField(item);
    this.setSubArmorPotionsrRigidComfortable()
      .then(() => this.consolidateSubArmorPotions())
      .then(() => {
        this.scaleAmalgamizedPortion();
        this.setAllLayer(item);
        this.setFeetRigid();
        this.setNonTraditionalNoRigid();
        this.setArmorRigidAndComfortable();
      })
      .then(() => this.setBreathability())
      .then(() => this.computeArmorResists())
      .then(() => this.mergalArmorResistCover())
      .catch((e) => console.error(e));
  }

  public getAvgEnvironmentalProtection() {
    let result = 0;
    if (isEmpty(this.data.armorPortions)) {
      return 0;
    }
    this.data.armorPortions.forEach(({ data: armorPortion }) => {
      result += armorPortion.environmentalProtection;
    });
    return Math.round(result / this.data.armorPortions.length);
  }

  /**
   * if SubArmorPortions no has Armor Material
   * we need pass item's material infer it
   * @param item base item info
   */
  private inferSubArmorPortionsArmorMaterial(item: ItemBase) {
    this.data.subArmorPortions.forEach((subArmorPortion) => {
      if (isEmpty(subArmorPortion.data.armorMaterials)) {
        const skipScale: boolean = item.data.materialPortionsTotal === 0;
        item.data.materials.forEach((itemMaterial) => {
          if (skipScale) {
            subArmorPortion.data.armorMaterials.push(
              new ArmorMaterial({
                type: itemMaterial[0].value.id,
                thickness:
                  item.data.materials.length *
                  subArmorPortion.data.avgThickness,
                ignore_sheet_thickness: true,
              })
            );
          } else {
            subArmorPortion.data.armorMaterials.push(
              new ArmorMaterial({
                type: itemMaterial[0].value.id,
                thickness:
                  (itemMaterial[1] / item.data.materialPortionsTotal) *
                  subArmorPortion.data.avgThickness,
                ignore_sheet_thickness: true,
              })
            );
          }
        });
      }
    });
  }

  /**
   * set max encumber, avgThickness, rigid and comfortable
   * @param item base item info
   */
  private setSubArmorPotionsField(item: ItemBase) {
    this.data.subArmorPortions.forEach((subArmorPortion) => {
      // set max encumber
      if (!subArmorPortion.data.maxEncumber) {
        let totalNonrigidVolume = 0;
        item.data.pockets?.map((pocket) => {
          if (!pocket.data.rigid) {
            totalNonrigidVolume +=
              pocket.data.volumeCapacity * pocket.data.volumeEncumberModifier;
          }
        });
        subArmorPortion.data.maxEncumber =
          subArmorPortion.data.encumber +
          (totalNonrigidVolume * subArmorPortion.data.volumeEncumberModifier) /
            250;
      }

      // reset avgThickness
      let armorMaterialCount = 0;
      let avgThickness = 0;
      subArmorPortion.data.armorMaterials.forEach((armorMaterial) => {
        avgThickness +=
          (armorMaterial.data.thickness * armorMaterial.data.coverage) / 100;
        armorMaterialCount++;
      });
      if (armorMaterialCount > 0 && avgThickness > 0) {
        subArmorPortion.data.avgThickness = avgThickness;
      }
    });
  }

  private setSubArmorPotionsrRigidComfortable() {
    return Promise.allSettled(
      this.data.subArmorPortions.map((subArmorPortion) =>
        Promise.allSettled(
          subArmorPortion.data.armorMaterials
            .filter((armorMaterial) => armorMaterial.data.coverage > 40)
            .map((armorMaterial) =>
              getNotEmptyJsonItems(
                CddaType.material,
                armorMaterial.data.id.value.id
              ).then((jsonItems) => {
                const temp = new Material(jsonItems[0]);
                if (temp.data.soft) {
                  subArmorPortion.data.isComfortable = true;
                } else {
                  subArmorPortion.data.isRigid = true;
                }
              })
            )
        )
      )
    );
  }
  /**
   * consolidate SubArmorPotions to ArmorPotions
   */
  private consolidateSubArmorPotions() {
    this.data.armorPortions = [];
    return Promise.allSettled(
      this.data.subArmorPortions
        .filter((subArmorPortion) =>
          isNotEmpty(subArmorPortion.data.coversBodyPart)
        )
        .map((subArmorPortion) => {
          return Promise.allSettled(
            subArmorPortion.data.coversBodyPart.map((subCover) => {
              let found = false;
              return Promise.allSettled(
                this.data.armorPortions
                  .filter((armorPortion) =>
                    hasAsyncName(armorPortion.data.coversBodyPart, subCover)
                  )
                  .map((armorPortion) => {
                    found = true;
                    addEncumber(armorPortion, subArmorPortion);
                    return Promise.all([
                      subArmorPortion.maxCoverage(subCover.value.id),
                      armorPortion.maxCoverage(subCover.value.id),
                    ])
                      .then((results) => {
                        const subScale = results[0] / 100;
                        const scale = results[1] / 100;
                        consolidatePortionBaseInfo(
                          armorPortion,
                          subArmorPortion,
                          subScale,
                          scale
                        );
                        consolidateMaterial(
                          subArmorPortion,
                          armorPortion,
                          subScale,
                          scale
                        );
                      })
                      .then(() =>
                        consolidateLayerAndSubBodyPart(
                          subArmorPortion,
                          armorPortion
                        )
                      );
                  })
              ).then(() => {
                if (!found) {
                  const newArmorPortion = getNewArmorPotrtion(
                    subArmorPortion,
                    subCover
                  );
                  this.data.armorPortions.push(newArmorPortion);
                }
              });
            })
          );
        })
    );

    function getNewArmorPotrtion(
      subArmorPortion: ArmorPortion,
      subCover: AsyncName
    ) {
      const newArmorPortion = cloneObject(subArmorPortion);
      newArmorPortion.data.coversBodyPart = [subCover];
      // ??? no clear coversSubBodyPart ???
      void newArmorPortion
        .maxCoverage(subCover.value.id)
        .then((maxCoverage) => {
          const scale = maxCoverage * 0.01;
          newArmorPortion.data.coverage *= scale;
          newArmorPortion.data.coverageMelee *= scale;
          newArmorPortion.data.coverageRanged *= scale;
        });
      newArmorPortion.data.armorMaterials.forEach((newArmorMaterial) => {
        newArmorMaterial.data.coverage *= newArmorPortion.data.coverage / 100;
      });
      return newArmorPortion;
    }

    function consolidateLayerAndSubBodyPart(
      subArmorPortion: ArmorPortion,
      armorPortion: ArmorPortion
    ) {
      subArmorPortion.data.layers.forEach((subLayer) => {
        if (
          !armorPortion.data.layers.some(
            (layer) => layer.value.id === subLayer.value.id
          )
        ) {
          armorPortion.data.layers.push(subLayer);
        }
      });

      subArmorPortion.data.coversSubBodyPart.forEach((subArmorSubBodyPart) => {
        if (
          !armorPortion.data.coversSubBodyPart.some(
            (armorSubBodyPart) =>
              armorSubBodyPart.value.id === subArmorSubBodyPart.value.id
          )
        ) {
          armorPortion.data.coversSubBodyPart.push(subArmorSubBodyPart);
        }
      });
    }

    function consolidatePortionBaseInfo(
      armorPortion: ArmorPortion,
      subArmorPortion: ArmorPortion,
      subScale: number,
      scale: number
    ) {
      armorPortion.data.coverage += subArmorPortion.data.coverage * subScale;
      armorPortion.data.coverageMelee +=
        subArmorPortion.data.coverageMelee * subScale;
      armorPortion.data.coverageRanged +=
        subArmorPortion.data.coverageRanged * subScale;
      armorPortion.data.coverageVitals += subArmorPortion.data.coverageVitals;

      armorPortion.data.avgThickness =
        (subArmorPortion.data.avgThickness * subScale +
          armorPortion.data.avgThickness * scale) /
        (subScale + scale);
      armorPortion.data.environmentalProtection =
        (subArmorPortion.data.environmentalProtection * subScale +
          armorPortion.data.environmentalProtection * scale) /
        (subScale + scale);
      armorPortion.data.environmentalProtectionWithFilter =
        (subArmorPortion.data.environmentalProtectionWithFilter * subScale +
          armorPortion.data.environmentalProtectionWithFilter * scale) /
        (subScale + scale);
    }

    function addEncumber(
      armorPortion: ArmorPortion,
      subArmorPortion: ArmorPortion
    ) {
      armorPortion.data.encumber += subArmorPortion.data.encumber;
      if (subArmorPortion.data.maxEncumber) {
        if (armorPortion.data.maxEncumber) {
          armorPortion.data.maxEncumber += subArmorPortion.data.maxEncumber;
        } else {
          armorPortion.data.maxEncumber = subArmorPortion.data.maxEncumber;
        }
      }
    }

    function consolidateMaterial(
      subArmorPortion: ArmorPortion,
      armorPortion: ArmorPortion,
      subScale: number,
      scale: number
    ) {
      subArmorPortion.data.armorMaterials.forEach((subArmorMaterial) => {
        let materialFound = false;
        armorPortion.data.armorMaterials.forEach(({ data: armorMaterial }) => {
          if (subArmorMaterial.data.id.value.id === armorMaterial.id.value.id) {
            materialFound = true;

            const coverageMultiplier =
              (subArmorPortion.data.coverage * subScale) / 100;

            armorMaterial.coverage +=
              (subArmorMaterial.data.coverage * coverageMultiplier) / 100;

            armorMaterial.thickness =
              (subScale * subArmorMaterial.data.thickness +
                scale * armorMaterial.thickness) /
              (subScale + scale);
          }
        });
        if (!materialFound) {
          const coverageMultiplier =
            (subArmorPortion.data.coverage * subScale) / 100;

          const newMaterial: ArmorMaterial = JSON.parse(
            JSON.stringify(subArmorMaterial)
          ) as ArmorMaterial;

          newMaterial.data.coverage =
            (subArmorMaterial.data.coverage * coverageMultiplier) / 100;
          armorPortion.data.armorMaterials.push(newMaterial);
        }
      });
    }
  }

  /**
   * scale armorPortions's material
   */
  private scaleAmalgamizedPortion() {
    this.data.armorPortions.forEach(({ data: armorPortion }) => {
      armorPortion.armorMaterials.forEach(({ data: armorMaterial }) => {
        if (armorPortion.coverage == 0) {
          armorMaterial.coverage = 100;
        } else {
          armorMaterial.coverage = Math.round(
            armorMaterial.coverage / (armorPortion.coverage / 100)
          );
        }
      });
    });
  }

  /**
   * set all Layer
   */
  private setAllLayer(item: ItemBase) {
    const armor = this.data;
    armor.allLayers = [];
    if (item.hasFlag(Flag.PERSONAL)) {
      armor.allLayers.push(new AsyncName(Flag.PERSONAL, CddaType.flag));
    }
    if (item.hasFlag(Flag.SKINTIGHT)) {
      armor.allLayers.push(new AsyncName(Flag.SKINTIGHT, CddaType.flag));
    }
    if (item.hasFlag(Flag.NORMAL)) {
      armor.allLayers.push(new AsyncName(Flag.NORMAL, CddaType.flag));
    }
    if (item.hasFlag(Flag.WAIST)) {
      armor.allLayers.push(new AsyncName(Flag.WAIST, CddaType.flag));
    }
    if (item.hasFlag(Flag.OUTER)) {
      armor.allLayers.push(new AsyncName(Flag.OUTER, CddaType.flag));
    }
    if (item.hasFlag(Flag.BELTED)) {
      armor.allLayers.push(new AsyncName(Flag.BELTED, CddaType.flag));
    }
    if (item.hasFlag(Flag.AURA)) {
      armor.allLayers.push(new AsyncName(Flag.AURA, CddaType.flag));
    }
    if (isEmpty(armor.allLayers)) {
      armor.allLayers = [new AsyncName(Flag.NORMAL, CddaType.flag)];
    }

    armor.armorPortions.forEach(({ data: armorPortion }) => {
      if (isEmpty(armorPortion.layers)) {
        armorPortion.layers = armor.allLayers;
      } else {
        armorPortion.layers.forEach((protionLayer) => {
          if (
            !armor.allLayers.some(
              (layer) => layer.value.id === protionLayer.value.id
            )
          ) {
            armor.allLayers.push(protionLayer);
          }
        });
      }
    });

    armor.subArmorPortions.forEach(({ data: subArmorPortion }) => {
      if (isEmpty(subArmorPortion.layers)) {
        subArmorPortion.layers = armor.allLayers;
      }
    });
  }

  private setFeetRigid() {
    const armor = this.data;
    armor.subArmorPortions.forEach(({ data: subArmorPortion }) => {
      const isNormal = subArmorPortion.layers.some(
        (layer) => layer.value.id === Flag.NORMAL
      );
      let isLeg = false;

      void Promise.all(
        subArmorPortion.coversSubBodyPart.map((coverSubBodyPart) => {
          return coverSubBodyPart
            .getJsonItems()
            .then((jsonItems) => new SubBodyPart(jsonItems[0]))
            .then((subBodyPart) => {
              if (
                subBodyPart.data.parent.value.id === 'bp_leg_l' ||
                subBodyPart.data.parent.value.id === 'bp_leg_r'
              )
                isLeg = true;
            });
        })
      ).then(() => {
        if (isNormal && isLeg) {
          subArmorPortion.isRigid = true;
        }
      });
    });
  }

  /**
   * NonTraditional is soft
   */
  private setNonTraditionalNoRigid() {
    const armor = this.data;
    armor.subArmorPortions.forEach(({ data: subArmorPortion }) => {
      if (
        !subArmorPortion.layers.some(
          ({ value: subLayer }) =>
            subLayer.id == Flag.SKINTIGHT ||
            subLayer.id == Flag.NORMAL ||
            subLayer.id == Flag.OUTER
        )
      ) {
        subArmorPortion.isRigid = false;
      }
    });
  }

  private setArmorRigidAndComfortable() {
    let allRigid = true;
    let allComfortable = true;

    const armor = this.data;
    armor.subArmorPortions.forEach(({ data: subArmorPortion }) => {
      allRigid = allRigid && subArmorPortion.isRigid;
      allComfortable = allComfortable && subArmorPortion.isComfortable;
    });
    armor.rigid = allRigid;
    armor.comfortable = allComfortable;
  }

  private setBreathability() {
    const armor = this.data;
    const needUpdateArmorPortion = new Array<ArmorPortion>();
    armor.armorPortions.forEach((armorPortion) => {
      if (
        !armorPortion.data.breathability ||
        armorPortion.data.breathability < 0
      ) {
        needUpdateArmorPortion.push(armorPortion);
      }
    });
    return Promise.allSettled(
      needUpdateArmorPortion.map((armorPortion) =>
        Promise.allSettled(
          armorPortion.data.armorMaterials.map((armorMaterial) =>
            armorMaterial.data.id
              .getJsonItems()
              .then(
                (jsonItems) =>
                  [new Material(jsonItems[0]), armorMaterial.data.coverage] as [
                    Material,
                    number
                  ]
              )
          )
        ).then((result) => {
          const newResult = result
            .filter((item) => item.status === 'fulfilled')
            .map((item) =>
              item.status === 'fulfilled' ? item.value : <[Material, number]>{}
            );
          const sordMaterial = newResult.sort(
            (a, b) => a[0].breathability() - b[0].breathability()
          );
          let coverage_counted = 0;
          let combined_breathability = 0;
          for (const material of sordMaterial) {
            combined_breathability += Math.max(
              (material[1] - coverage_counted) * material[0].breathability(),
              0
            );
            coverage_counted = Math.max(material[1], coverage_counted);
            if (coverage_counted == 100) break;
          }
          armorPortion.data.breathability =
            combined_breathability / 100 + 100 - coverage_counted;
        })
      )
    );
  }

  private computeArmorResists() {
    const armor = this.data;
    const env = this.getAvgEnvironmentalProtection();
    const subArmorPortionResistPromises = armor.subArmorPortions.map(
      (subArmorPortion) =>
        getSubBodyPartArmorResist(subArmorPortion, env).then(mergalArmorResist)
    );
    return Promise.allSettled(subArmorPortionResistPromises)
      .then((subArmorPortionResists) => {
        let result = new Array<ArmorResistInterface>();
        subArmorPortionResists.forEach((subArmorPortionResist) => {
          if (subArmorPortionResist.status === 'fulfilled') {
            result.push(...subArmorPortionResist.value);
            result = mergalArmorResist(result);
          }
        });
        armor.armorResists = result;
      })
      .catch((e) => console.error(e));
  }

  private mergalArmorResistCover() {
    const armor = this.data;
    return Promise.allSettled(
      armor.armorResists.map((resist) => {
        resist.formatCovers = [];
        return Promise.allSettled(
          resist.coversSubBodyPart.map((subBodyPartName) =>
            subBodyPartName
              .getJsonItems()
              .then(
                (jsonItems) =>
                  <[AsyncName, SubBodyPart]>[
                    subBodyPartName,
                    new SubBodyPart(jsonItems[0]),
                  ]
              )
          )
        ).then((allResults) => {
          const subBodyParts = new Array<[AsyncName, SubBodyPart]>();
          const parents = new Array<AsyncName>();
          allResults.forEach((allResult) => {
            if (allResult.status === 'fulfilled') {
              subBodyParts.push(allResult.value);
              if (
                !parents.find(
                  (parent) =>
                    parent.value.id === allResult.value[1].data.parent.value.id
                )
              ) {
                parents.push(allResult.value[1].data.parent);
              }
            }
          });
          return Promise.allSettled(
            parents.map((parent) =>
              parent
                .getJsonItems()
                .then(
                  (jsonItems) =>
                    <[AsyncName, BodyPart]>[parent, new BodyPart(jsonItems[0])]
                )
            )
          ).then((allResults) => {
            const bodyParts = new Array<[AsyncName, BodyPart]>();
            allResults.forEach((allResult) => {
              if (allResult.status === 'fulfilled') {
                bodyParts.push(allResult.value);
              }
            });
            bodyParts.forEach((bodyPart) => {
              const currentSubBodyParts = subBodyParts.filter(
                (subBodyPart) =>
                  subBodyPart[1].data.parent.value.id === bodyPart[0].value.id
              );
              resist.formatCovers.push([
                bodyPart[0],
                currentSubBodyParts.length ===
                bodyPart[1].data.subBodyParts.length
                  ? []
                  : currentSubBodyParts.map(
                      (curSubBodyPart) => curSubBodyPart[0]
                    ),
              ]);
            });
          });
        });
      })
    );
  }
}

interface ArmorInterface {
  sided: boolean;
  nonFunctional?: AsyncName;
  warmth: number;
  weightCapacityModifier: number;
  weightCapacityBonus: number;
  powerArmor: boolean;
  armorPortions: ArmorPortion[];
  subArmorPortions: ArmorPortion[];
  rigid: boolean;
  comfortable: boolean;
  validMods: AsyncName[];
  materialThickness?: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
  allLayers: AsyncName[];

  armorResists: ArmorResistInterface[];
}

interface ArmorResistInterface {
  probability: number;
  formatCovers: [AsyncName, AsyncName[]][];
  coversSubBodyPart: AsyncName[];

  bashResist: number;
  cutResist: number;
  stabResist: number;
  bulletResist: number;

  acidResist: number;
  fireResist: number;
  encumber: number;
  maxEncumber?: number;
  envResist: number;
  envFilterResist: number;
}

function viewArmorResistInterface(armorResist: ArmorResistInterface): VNode[] {
  const result: VNode[] = [];

  result.push(
    h(MyField, { label: 'cover' }, () =>
      foreachVNode(
        armorResist.formatCovers ?? [],
        (formatCover) => {
          const temp = [h(MyText, { content: formatCover[0].getName() })];
          if (isNotEmpty(formatCover[1])) {
            temp.push(
              h(MyText, {
                content: '(',
              })
            );
            temp.push(
              h(MyText, {
                content: formatCover[1].map((sub) => sub.getName()),
                separator: ', ',
              })
            );
            temp.push(
              h(MyText, {
                content: ')',
              })
            );
          }
          return temp;
        },
        ', '
      )
    ),
    h(MyField, { label: 'probability' }, () => [
      h(MyText, {
        content: armorResist.probability,
      }),
    ]),
    h(MyField, { label: 'encumber' }, () => [
      h(MyText, {
        content: armorResist.encumber,
      }),
    ]),
    h(
      MyField,
      {
        label: 'maxEncumber',
        isHide: () => armorResist.encumber === armorResist.maxEncumber,
      },
      () => [
        h(MyText, {
          content: armorResist.maxEncumber,
        }),
      ]
    ),
    h(MyField, { label: 'bash' }, () => [
      h(MyText, {
        content: armorResist.bashResist,
      }),
    ]),
    h(MyField, { label: 'cut' }, () => [
      h(MyText, {
        content: armorResist.cutResist,
      }),
    ]),
    h(MyField, { label: 'stab' }, () => [
      h(MyText, {
        content: armorResist.stabResist,
      }),
    ]),
    h(MyField, { label: 'bullet' }, () => [
      h(MyText, {
        content: armorResist.bulletResist,
      }),
    ]),
    h(MyField, { label: 'acid' }, () => [
      h(MyText, {
        content: armorResist.acidResist,
      }),
    ]),
    h(MyField, { label: 'fire' }, () => [
      h(MyText, {
        content: armorResist.fireResist,
      }),
    ]),
    h(MyField, { label: 'environmental' }, () => [
      h(MyText, {
        content: armorResist.envResist,
      }),
    ])
  );
  if (armorResist.envFilterResist > armorResist.envResist) {
    result.push(
      h(MyField, { label: 'environmentalWithFilter' }, () => [
        h(MyText, {
          content: armorResist.envFilterResist,
        }),
      ])
    );
  }
  return result;
}

function mergalArmorResist(armorResists: ArmorResistInterface[]) {
  const result = new Array<ArmorResistInterface>();
  armorResists.forEach((armorResist) => {
    let found = false;
    result.forEach((resultArmorResist) => {
      if (equalArmorResist(resultArmorResist, armorResist)) {
        found = true;
        // add cover
        armorResist.coversSubBodyPart.forEach((newCover) => {
          if (
            !resultArmorResist.coversSubBodyPart.find(
              (cover) => cover.value.id === newCover.value.id
            )
          ) {
            resultArmorResist.coversSubBodyPart.push(newCover);
          }
        });
        //add probability
        resultArmorResist.probability += armorResist.probability;
      }
    });
    if (!found) {
      result.push(armorResist);
    }
  });
  return result;
}

function equalArmorResist(
  l: ArmorResistInterface,
  r: ArmorResistInterface
): boolean {
  return (
    l.probability === r.probability &&
    l.bashResist === r.bashResist &&
    l.cutResist === r.cutResist &&
    l.stabResist === r.stabResist &&
    l.bulletResist === r.bulletResist &&
    l.acidResist === r.acidResist &&
    l.fireResist === r.fireResist &&
    l.encumber === r.encumber &&
    l.maxEncumber === r.maxEncumber &&
    l.envResist === r.envResist &&
    l.envFilterResist === r.envFilterResist
  );
}

async function getSubBodyPartArmorResist(
  armorPortion: ArmorPortion,
  avgEnvironmentalProtection: number
): Promise<ArmorResistInterface[]> {
  let result = new Array<ArmorResistInterface>({
    probability: 100,
    formatCovers: [],
    coversSubBodyPart: armorPortion.data.coversSubBodyPart,
    bashResist: 0,
    cutResist: 0,
    stabResist: 0,
    bulletResist: 0,
    acidResist: 0,
    fireResist: 0,
    encumber: armorPortion.data.encumber,
    maxEncumber: armorPortion.data.maxEncumber,
    envResist: armorPortion.data.environmentalProtection,
    envFilterResist: armorPortion.data.environmentalProtectionWithFilter,
  });
  return Promise.allSettled(
    armorPortion.data.armorMaterials.map((armorMaterial) => {
      return armorMaterial.data.id.getJsonItems().then((jsonItems) => {
        const armorMaterialObject = new Material(jsonItems[0]);
        return <[Material, ArmorMaterial]>[armorMaterialObject, armorMaterial];
      });
    })
  )
    .then((armorMaterialObjects) => {
      armorMaterialObjects.forEach((item) => {
        if (item.status === 'fulfilled') {
          const armorMaterialObject = item.value[0];
          const armorMaterial = item.value[1];
          const newResult = new Array<ArmorResistInterface>();
          result.forEach((resultItem) => {
            const hitArmorResist = {} as ArmorResistInterface;
            hitArmorResist.probability =
              resultItem.probability * armorMaterial.data.coverage * 0.01;
            hitArmorResist.coversSubBodyPart =
              armorPortion.data.coversSubBodyPart;
            hitArmorResist.bashResist =
              resultItem.bashResist +
              armorMaterialObject.data.bashResist *
                armorMaterial.data.thickness;
            hitArmorResist.cutResist =
              resultItem.cutResist +
              armorMaterialObject.data.cutResist * armorMaterial.data.thickness;
            // stab resist is cut's 80%
            hitArmorResist.stabResist =
              resultItem.stabResist +
              armorMaterialObject.data.cutResist *
                0.8 *
                armorMaterial.data.thickness;
            hitArmorResist.bulletResist =
              resultItem.bulletResist +
              armorMaterialObject.data.bulletResist *
                armorMaterial.data.thickness;

            hitArmorResist.acidResist =
              armorMaterialObject.data.acidResist *
              armorMaterial.data.coverage *
              0.01;
            hitArmorResist.fireResist =
              armorMaterialObject.data.fireResist *
              armorMaterial.data.coverage *
              0.01;
            if (avgEnvironmentalProtection < 10) {
              hitArmorResist.acidResist *= avgEnvironmentalProtection * 0.1;
              hitArmorResist.fireResist *= avgEnvironmentalProtection * 0.1;
            }
            hitArmorResist.acidResist += resultItem.acidResist;
            hitArmorResist.fireResist += resultItem.fireResist;
            hitArmorResist.encumber = resultItem.encumber;
            hitArmorResist.maxEncumber = resultItem.maxEncumber;
            hitArmorResist.envResist = resultItem.envResist;
            hitArmorResist.envFilterResist = resultItem.envFilterResist;
            newResult.push(hitArmorResist);
            // if the material is miss
            if (armorMaterial.data.coverage < 100) {
              const missArmorResist = cloneObject(resultItem);
              missArmorResist.probability =
                resultItem.probability *
                (100 - armorMaterial.data.coverage) *
                0.01;
              newResult.push(missArmorResist);
            }
          });
          result = newResult;
        }
      });
    })
    .then(() => result);
}
