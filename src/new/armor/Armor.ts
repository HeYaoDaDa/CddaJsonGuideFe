import { isEmpty, isNotEmpty } from 'src/utils';
import { getNotEmptyJsonItems } from 'src/utils/baseJsonItemMapUtil';
import { cloneObject } from 'src/utils/DataUtil';
import { VNode } from 'vue';
import { AsyncName, generateAsyncNames, hasAsyncName } from '../AsyncName';
import { Flag } from '../FlagsContant';
import {
  getArray,
  getBoolean,
  getNumber,
  getOptionalArray,
  getOptionalNumber,
  getString,
} from '../JsonUtil';
import { Material } from '../material/Material';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { ArmorMaterial } from './ArmorMaterial';
import { ArmorPortion } from './ArmorPortion';
import { ItemBase } from './ItemBase';

export class Armor extends SuperData<ArmorInterface> {
  constructor(value: object) {
    super(value);
  }
  getView(): VNode[] {
    return [];
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
    data.nonFunctional = new AsyncName(
      getString(jsonObject, 'non_functional', ''),
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

  private load(item: ItemBase) {
    const data = this.data;
    this.inferSubArmorPortionsArmorMaterial(item);
    this.setSubArmorPotionsField(item);
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

      // set rigid and comfortable
      subArmorPortion.data.armorMaterials.forEach((armorMaterial) => {
        if (armorMaterial.data.coverage > 40) {
          void getNotEmptyJsonItems(
            CddaType.material,
            armorMaterial.data.id.value.id
          ).then((jsonItems) => {
            const temp = new Material(jsonItems[0]);
            if (temp.data.soft) {
              subArmorPortion.data.isComfortable = true;
            } else {
              subArmorPortion.data.isRigid = true;
            }
          });
        }
      });
    });
  }

  /**
   * consolidate SubArmorPotions to ArmorPotions
   */
  private consolidateSubArmorPotions() {
    this.data.subArmorPortions.forEach((subArmorPortion) => {
      if (isNotEmpty(subArmorPortion.data.coversBodyPart)) {
        subArmorPortion.data.coversBodyPart.forEach((subCover) => {
          let found = false;
          this.data.armorPortions.forEach((armorPortion) => {
            if (hasAsyncName(armorPortion.data.coversBodyPart, subCover)) {
              found = true;
              armorPortion.data.encumber += subArmorPortion.data.encumber;
              if (subArmorPortion.data.maxEncumber) {
                if (armorPortion.data.maxEncumber) {
                  armorPortion.data.maxEncumber +=
                    subArmorPortion.data.maxEncumber;
                } else {
                  armorPortion.data.maxEncumber =
                    subArmorPortion.data.maxEncumber;
                }
              }
              void Promise.all([
                subArmorPortion.maxCoverage(subCover.value.id),
                armorPortion.maxCoverage(subCover.value.id),
              ]).then((results) => {
                const subScale = results[0] / 100;
                const scale = results[1] / 100;

                armorPortion.data.coverage +=
                  subArmorPortion.data.coverage * subScale;
                armorPortion.data.coverageMelee +=
                  subArmorPortion.data.coverageMelee * subScale;
                armorPortion.data.coverageRanged +=
                  subArmorPortion.data.coverageRanged * subScale;
                armorPortion.data.coverageVitals +=
                  subArmorPortion.data.coverageVitals;

                armorPortion.data.avgThickness =
                  (subArmorPortion.data.avgThickness * subScale +
                    armorPortion.data.avgThickness * scale) /
                  (subScale + scale);
                armorPortion.data.environmentalProtection =
                  (subArmorPortion.data.environmentalProtection * subScale +
                    armorPortion.data.environmentalProtection * scale) /
                  (subScale + scale);
                armorPortion.data.environmentalProtectionWithFilter =
                  (subArmorPortion.data.environmentalProtectionWithFilter *
                    subScale +
                    armorPortion.data.environmentalProtectionWithFilter *
                      scale) /
                  (subScale + scale);

                subArmorPortion.data.armorMaterials.forEach(
                  (subArmorMaterial) => {
                    let materialFound = false;
                    armorPortion.data.armorMaterials.forEach(
                      ({ data: armorMaterial }) => {
                        if (
                          subArmorMaterial.data.id.value.id ===
                          armorMaterial.id.value.id
                        ) {
                          materialFound = true;

                          const coverageMultiplier =
                            (subArmorPortion.data.coverage * subScale) / 100;

                          armorMaterial.coverage +=
                            (subArmorMaterial.data.coverage *
                              coverageMultiplier) /
                            100;

                          armorMaterial.thickness =
                            (subScale * subArmorMaterial.data.thickness +
                              scale * armorMaterial.thickness) /
                            (subScale + scale);
                        }
                      }
                    );
                    if (!materialFound) {
                      const coverageMultiplier =
                        (subArmorPortion.data.coverage * subScale) / 100;

                      const newMaterial: ArmorMaterial = JSON.parse(
                        JSON.stringify(subArmorMaterial)
                      ) as ArmorMaterial;

                      newMaterial.data.coverage =
                        (subArmorMaterial.data.coverage * coverageMultiplier) /
                        100;
                      armorPortion.data.armorMaterials.push(newMaterial);
                    }
                  }
                );
              });

              subArmorPortion.data.layers.forEach((subLayer) => {
                if (
                  !armorPortion.data.layers.some(
                    (layer) => layer.value.id === subLayer.value.id
                  )
                ) {
                  armorPortion.data.layers.push(subLayer);
                }
              });

              subArmorPortion.data.coversSubBodyPart.forEach(
                (subArmorSubBodyPart) => {
                  if (
                    !armorPortion.data.coversSubBodyPart.some(
                      (armorSubBodyPart) =>
                        armorSubBodyPart.value.id ===
                        subArmorSubBodyPart.value.id
                    )
                  ) {
                    armorPortion.data.coversSubBodyPart.push(
                      subArmorSubBodyPart
                    );
                  }
                }
              );
            }
          });
          if (!found) {
            const newArmorPortion = cloneObject(subArmorPortion);
            newArmorPortion.data.coversBodyPart = [subCover];
            // ??? no clear coversSubBodyPart ???
            void newArmorPortion
              .maxCoverage(subCover.value.id)
              .then((scale) => {
                newArmorPortion.data.coverage *= scale;
                newArmorPortion.data.coverageMelee *= scale;
                newArmorPortion.data.coverageRanged *= scale;
              });
            newArmorPortion.data.armorMaterials.forEach((newArmorMaterial) => {
              newArmorMaterial.data.coverage *=
                newArmorPortion.data.coverage / 100;
            });

            this.data.armorPortions.push(newArmorPortion);
          }
        });
      }
    });
  }

  /**
   * scale armorPortions's material
   */
  private scaleAmalgamizedPortion() {
    this.data.armorPortions.forEach(({ data: armorPortion }) => {
      armorPortion.armorMaterials.forEach(({ data: armorMaterial }) => {
        if (armorPortion.coverage == 0) {
          armorMaterial.coverage = 0;
        } else {
          armorMaterial.coverage = Math.round(
            armorMaterial.coverage / armorPortion.coverage / 100
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
            .then(
              (jsonItems) =>
                jsonItems[0].content as {
                  parent: string;
                  max_coverage: number;
                  secondary?: boolean;
                }
            )
            .then((subBodyPart) => {
              if (
                subBodyPart.parent === 'bp_leg_l' ||
                subBodyPart.parent === 'bp_leg_r'
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

  // private setBreathability(){
  //   const armor = this.data;
  //   armor.armorPortions.forEach(({ data: armorPortion }) => {
  //     if(!armorPortion.breathability||armorPortion.breathability<0){
  //       const sortedMaterials = armorPortion.armorMaterials
  //     }
  //   })
  // }
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
}
