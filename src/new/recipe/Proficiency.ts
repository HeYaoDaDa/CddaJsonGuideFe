import { VNode } from 'vue';
import { getNumber } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';

export class Proficiency extends SuperData<ProficiencyInterface> {
  constructor(value: JsonItem | undefined) {
    super(value);
    if (value && this.validateValue(value)) {
      this.parseJson(value);
    }
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.proficiency;
  }

  getView(): VNode[] {
    const result: VNode[] = [];
    const data = this.data;

    return result;
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.defaultTimeMultiplier = getNumber(
      jsonObject,
      'default_time_multiplier',
      2
    );
    data.defaultFailMultiplier = getNumber(
      jsonObject,
      'default_fail_multiplier',
      2
    );
  }
}

interface ProficiencyInterface {
  defaultTimeMultiplier: number;
  defaultFailMultiplier: number;
}
