import { VNode, h } from 'vue';
import { getBoolean, getNumber, getVolume } from '../JsonUtil';
import { SuperData } from '../SuperData';
import MyText from '../components/MyText/MyText.vue';
import MyField from '../components/MyField.vue';

export class MaterialBurn extends SuperData<MaterialBurnInterface> {
  constructor(value: object) {
    super(value);
    this.parseJson(value);
  }
  getView(): VNode[] {
    const burn = this.data;
    return [
      h(MyField, { label: 'immune' }, [h(MyText, { content: burn.immune })]),
      h(MyField, { label: 'volumePerTurn' }, [
        h(MyText, { content: burn.volumePerTurn }),
      ]),
      h(MyField, { label: 'fuel' }, [h(MyText, { content: burn.fuel })]),
      h(MyField, { label: 'smoke' }, [h(MyText, { content: burn.smoke })]),
      h(MyField, { label: 'burn' }, [h(MyText, { content: burn.burn })]),
    ];
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.immune = getBoolean(jsonObject, 'immune');
    data.volumePerTurn = getVolume(jsonObject, 'volume_per_turn');
    data.fuel = getNumber(jsonObject, 'fuel');
    data.smoke = getNumber(jsonObject, 'smoke');
    data.burn = getNumber(jsonObject, 'burn');
  }
}

interface MaterialBurnInterface {
  immune: boolean;
  volumePerTurn: number;
  fuel: number;
  smoke: number;
  burn: number;
}
