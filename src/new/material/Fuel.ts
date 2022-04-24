import { VNode, h } from 'vue';
import { getBoolean, getNumber, getOptionalAsyncName } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { AsyncName } from '../AsyncName';
import { FuelExplosion } from './FuelExplosion';
import { CddaType } from '../type';
import MyText from '../components/MyText/MyText.vue';
import MyField from '../components/MyField.vue';

export class Fuel extends SuperData<FuelInterface> {
  constructor(value: object) {
    super(value);
    this.parseJson(value);
  }
  getView(): VNode[] {
    const fuel = this.data;
    const result: VNode[] = [];

    result.push(
      h(MyField, { label: 'energy' }, [h(MyText, { content: fuel.energy })])
    );
    result.push(
      h(MyField, { label: 'perperualFuel' }, [
        h(MyText, { content: fuel.isPerpetualFuel }),
      ])
    );
    if (fuel.explosionData) {
      result.push(
        h(MyField, { label: 'explosion' }, [fuel.explosionData?.getView()])
      );
    }
    if (fuel.pumpTerrain) {
      result.push(
        h(MyField, { label: 'pumpTerrain' }, [
          h(MyText, { content: fuel.pumpTerrain?.value.name }),
        ])
      );
    }

    return result;
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.energy = getNumber(jsonObject, 'energy', 0);
    if (jsonObject.hasOwnProperty('explosion_data')) {
      data.explosionData = new FuelExplosion(
        jsonObject.explosion_data as object
      );
    }
    data.pumpTerrain = getOptionalAsyncName(
      jsonObject,
      'pump_terrain',
      CddaType.terrain
    );
    data.isPerpetualFuel = getBoolean(jsonObject, 'perpetual', false);
  }
}

interface FuelInterface {
  energy: number;
  explosionData?: FuelExplosion;
  pumpTerrain?: AsyncName;
  isPerpetualFuel: boolean;
}
