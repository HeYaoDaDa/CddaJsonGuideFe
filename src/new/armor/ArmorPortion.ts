import { isEmpty, isNotEmpty } from 'src/utils';
import { VNode } from 'vue';
import { AsyncName, generateAsyncNames } from '../AsyncName';
import {
  getArray,
  getBoolean,
  getNumber,
  getOptionalNumber,
} from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { ArmorMaterial } from './ArmorMaterial';
export class ArmorPortion extends SuperData<ArmorPortionInterface> {
  constructor(value: object | undefined) {
    super(value);
    if (value) {
      if (this.validateValue(value)) {
        this.parseJson(value);
      } else {
        console.warn('ArmorPortion validate fail, value: %o', value);
      }
    }
  }

  validateValue(value: object): boolean {
    return value.hasOwnProperty('covers');
  }

  getView(): VNode[] {
    return [];
  }

  public maxCoverage(bodyPartId: string): Promise<number> {
    if (isEmpty(this.data.coversSubBodyPart)) {
      return Promise.resolve(100);
    }
    let primary = 0;
    let secondary = 0;
    const temp: Promise<void>[] = this.data.coversSubBodyPart.map((subCover) =>
      subCover
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
          if (subBodyPart.parent === bodyPartId) {
            if (subBodyPart.secondary) {
              secondary += subBodyPart.max_coverage;
            } else {
              primary += subBodyPart.max_coverage;
            }
          }
        })
    );
    return Promise.allSettled(temp).then(() =>
      primary > secondary ? primary : secondary
    );
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    this.parseEncumber(jsonObject);

    data.volumeEncumberModifier = getNumber(
      jsonObject,
      'volume_encumber_modifier',
      1
    );

    data.coverage = getNumber(jsonObject, 'coverage', 0);
    data.coverageMelee = getNumber(jsonObject, 'cover_melee', data.coverage);
    data.coverageRanged = getNumber(jsonObject, 'cover_ranged', data.coverage);
    data.coverageVitals = getNumber(jsonObject, 'cover_vitals', 0);

    data.avgThickness = getNumber(jsonObject, 'material_thickness', 0);

    data.environmentalProtection = getNumber(
      jsonObject,
      'environmental_protection',
      0
    );
    data.environmentalProtectionWithFilter = getNumber(
      jsonObject,
      'environmental_protection_with_filter',
      0
    );

    this.parseArmorMaterial(jsonObject);

    data.coversBodyPart = getArray(jsonObject, 'covers', []).map(
      (value) => new AsyncName(<string>value, CddaType.bodyPart)
    );
    this.parseCoversSubBodyParts(jsonObject);
    data.layers = getArray(jsonObject, 'layers', []).map(
      (value) => new AsyncName(<string>value, CddaType.flag)
    );

    data.breathability = getOptionalNumber(jsonObject, 'breathability');
    data.isRigidLayerOnly = getBoolean(jsonObject, 'rigid_layer_only', false);
  }

  private parseArmorMaterial(jsonObject: Record<string, unknown>) {
    const temp = getArray(jsonObject, 'material', []);
    if (isNotEmpty(temp)) {
      if (typeof temp[0] === 'object') {
        this.data.armorMaterials = temp.map(
          (material) => new ArmorMaterial(<object>material)
        );
      } else {
        this.data.armorMaterials = temp.map(
          (materialId) => new ArmorMaterial({ type: materialId })
        );
      }
    } else {
      this.data.armorMaterials = [];
    }
  }

  private parseEncumber(jsonObject: Record<string, unknown>) {
    if (jsonObject.hasOwnProperty('encumbrance')) {
      const temp = jsonObject.encumbrance;
      if (Array.isArray(temp)) {
        this.data.encumber = (<Array<number>>temp)[0];
        this.data.maxEncumber = (<Array<number>>temp)[1];
      } else {
        this.data.encumber = <number>temp;
      }
    } else {
      this.data.encumber = 0;
    }
  }

  private parseCoversSubBodyParts(jsonObject: Record<string, unknown>) {
    this.data.coversSubBodyPart = getArray(
      jsonObject,
      'specifically_covers',
      []
    ).map((value) => new AsyncName(<string>value, CddaType.subBodyPart));
    // if is empty, add body part's all sub body part
    if (
      isEmpty(this.data.coversSubBodyPart) &&
      isNotEmpty(this.data.coversBodyPart)
    ) {
      this.data.coversBodyPart.forEach((item) => {
        void item
          .getJsonItems()
          .then((jsonItems) =>
            this.data.coversSubBodyPart.push(
              ...generateAsyncNames(
                (<{ sub_parts: string[] }>jsonItems[0].content).sub_parts,
                CddaType.subBodyPart
              )
            )
          );
      });
    }
  }
}

interface ArmorPortionInterface {
  encumber: number;
  maxEncumber?: number;

  volumeEncumberModifier: number;

  coverage: number;
  coverageMelee: number;
  coverageRanged: number;
  coverageVitals: number;

  avgThickness: number;

  environmentalProtection: number;
  environmentalProtectionWithFilter: number;

  armorMaterials: ArmorMaterial[];

  coversBodyPart: AsyncName[];
  coversSubBodyPart: AsyncName[];
  layers: AsyncName[];

  breathability?: number;
  isRigidLayerOnly: boolean;

  isRigid: boolean;
  isUniqueLayering: boolean;
  isComfortable: boolean;
}
