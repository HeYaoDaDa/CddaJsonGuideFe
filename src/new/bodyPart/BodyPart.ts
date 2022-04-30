import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import MyField from '../components/MyField.vue';
import MyText from '../components/MyText/MyText.vue';
import { getArray, getOptionalString } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';

export class BodyPart extends SuperData<BodyPartInterface> {
  constructor(value: JsonItem | undefined) {
    super(value);
    if (value && this.validateValue(value)) {
      this.parseJson(value.content);
    }
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.bodyPart;
  }

  getView(): VNode[] {
    const data = this.data;
    const result: VNode[] = [];

    if (data.nameMultiple) {
      result.push(
        h(MyField, { label: 'nameMultiple' }, () => [data.nameMultiple])
      );
    }
    result.push(
      h(MyField, { label: 'hit_size' }, () => [
        h(MyText, { content: data.hitSize }),
      ])
    );

    return result;
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.nameMultiple = getOptionalString(jsonObject, 'name_multiple');
    data.subBodyParts = getArray(jsonObject, 'sub_parts').map(
      (value) => new AsyncName(<string>value, CddaType.subBodyPart)
    );
  }
}

interface BodyPartInterface {
  subBodyParts: AsyncName[];

  nameMultiple?: string;
  hitSize: number;
  hitdifficulty: number;
  partSide: string;

  encumbranceThreshold: number;
  encumbranceLimit: number;
  healthLimit: number;

  smashEfficiency: number;

  hotMoraleMod: number;
  coldMoraleMod: number;
  stylishBonus: number;
  squeamishPenalty: number;
  feelsDiscomfort: boolean;

  fireWarmthBonus: number;

  envProtection: number;
  baseHp: number;
  healBonus: number;
  mendRate: number;

  ugliness: number;
  uglinessMandatory: number;

  tempMin: number;
  tempMax: number;
  drenchMax: number;
  drenchIncrement: number;
  dryingChance: number;
  dryingIncrement: number;
  wetMorale: number;
  techniqueEncLimit: number;

  bionicSlots: number;
  PrimaryLimbType: string;
}
