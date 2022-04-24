import { VNode } from 'vue';
import { getBoolean, getNumber } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { Shrapnel } from './Shrapnel';

export class Explosion extends SuperData<ExplosionInterface> {
  constructor(value: object) {
    super(value);
    if (this.validateValue(value)) {
      this.parseJson(value);
    } else {
      console.warn('Explosion validate fail, value: %o', value);
    }
  }
  validateValue(value: object): boolean {
    return value.hasOwnProperty('power');
  }
  getView(): VNode[] {
    return [];
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.power = getNumber(jsonObject, 'power', 0);
    data.distanceFactor = getNumber(jsonObject, 'distance_factor', 0.75);
    data.maxNoise = getNumber(jsonObject, 'max_noise ', 90000000);
    data.fire = getBoolean(jsonObject, 'fire', false);

    if (jsonObject.hasOwnProperty('shrapnel')) {
      const temp = jsonObject.shrapnel;
      if (typeof temp === 'number') {
        data.shrapnel = new Shrapnel({ casing_mass: temp });
      } else {
        data.shrapnel = new Shrapnel(temp as object);
      }
    }
  }
}

interface ExplosionInterface {
  power: number;
  distanceFactor: number;
  maxNoise: number;
  fire: boolean;
  shrapnel?: Shrapnel;
}
