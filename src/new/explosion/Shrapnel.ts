import { VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import { getNumber, getOptionalAsyncName } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';

export class Shrapnel extends SuperData<ShrapnelInterface> {
  constructor(value: object) {
    super(value);
    if (this.validateValue(value)) {
      this.parseJson(value);
    } else {
      console.warn('Shrapnel validate fail, value: %o', value);
    }
  }
  validateValue(value: object): boolean {
    return value.hasOwnProperty('casing_mass');
  }
  getView(): VNode[] {
    return [];
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.casingMass = getNumber(jsonObject, 'casing_mass', 0);
    data.fragmentMass = getNumber(jsonObject, 'fragment_mass', 0.08);
    data.recovery = getNumber(jsonObject, 'recovery', 0);
    data.drop = getOptionalAsyncName(jsonObject, 'drop', CddaType.item);
  }
}

interface ShrapnelInterface {
  casingMass: number;
  fragmentMass: number;
  recovery: number;
  drop?: AsyncName;
}
