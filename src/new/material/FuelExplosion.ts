import { VNode, h } from 'vue';
import { getBoolean, getNumber } from '../JsonUtil';
import { SuperData } from '../SuperData';
import MyText from '../components/MyText/MyText.vue';
import MyField from '../components/MyField.vue';

export class FuelExplosion extends SuperData<FuelExplosionInterface> {
  constructor(value: object) {
    super(value);
    this.parseJson(value);
  }
  getView(): VNode[] {
    const fuel = this.data;
    return [
      h(MyField, { label: 'chanceHot' }, [
        h(MyText, { content: fuel.chanceHot }),
      ]),
      h(MyField, { label: 'chanceCold' }, [
        h(MyText, { content: fuel.chanceCold }),
      ]),
      h(MyField, { label: 'factor' }, [h(MyText, { content: fuel.factor })]),
      h(MyField, { label: 'sizeFactor' }, [
        h(MyText, { content: fuel.sizeFactor }),
      ]),
      h(MyField, { label: 'fiery' }, [h(MyText, { content: fuel.fiery })]),
    ];
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.chanceHot = getNumber(jsonObject, 'chance_hot', 0);
    data.chanceCold = getNumber(jsonObject, 'chance_cold', 0);
    data.factor = getNumber(jsonObject, 'factor', 0);
    data.sizeFactor = getNumber(jsonObject, 'size_factor', 0);
    data.fiery = getBoolean(jsonObject, 'fiery', false);
  }
}

interface FuelExplosionInterface {
  chanceHot: number;
  chanceCold: number;
  factor: number;
  sizeFactor: number;
  fiery: boolean;
}
