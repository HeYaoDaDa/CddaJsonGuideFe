import { isEmpty, isNotEmpty } from 'src/utils';
import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import MyField from '../components/MyField.vue';
import MyText from '../components/MyText/MyText.vue';
import {
  getArray,
  getBoolean,
  getNumber,
  getOptionalArray,
  getOptionalAsyncName,
  getOptionalNumber,
  getString,
  getTranslationString,
} from '../JsonUtil';
import { SuperData } from '../SuperData';
import { Translation } from '../translation';
import { BreathabilityRating, CddaType } from '../type';
import { Fuel } from './Fuel';
import { MaterialBurn } from './MaterialBurn';

export class Material extends SuperData<MaterialInterface> {
  constructor(value: JsonItem | undefined) {
    super(value);
    if (value) {
      if (this.validateValue(value)) {
        this.parseJson(value.content);
      } else {
        console.warn('Material validate fail, value: %o', value);
      }
    }
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.material;
  }

  getView(): VNode[] {
    const material = this.data;
    const result: VNode[] = [];

    result.push(
      h(MyField, { label: 'name' }, [h(MyText, { content: material.name })])
    );
    if (material.salvagedInto) {
      result.push(
        h(MyField, { label: 'salvagedInto' }, [
          h(MyText, { content: material.salvagedInto?.value.id }),
        ])
      );
    }
    if (material.repairedWith) {
      result.push(
        h(MyField, { label: 'repairedWith' }, [
          h(MyText, { content: material.repairedWith?.value.id }),
        ])
      );
    }
    result.push(
      h(MyField, { label: 'bashResist' }, [
        h(MyText, { content: material.bashResist }),
      ]),
      h(MyField, { label: 'cutResist' }, [
        h(MyText, { content: material.cutResist }),
      ]),
      h(MyField, { label: 'bulletResist' }, [
        h(MyText, { content: material.bulletResist }),
      ]),
      h(MyField, { label: 'acidResist' }, [
        h(MyText, { content: material.acidResist }),
      ]),
      h(MyField, { label: 'elecResist' }, [
        h(MyText, { content: material.elecResist }),
      ]),
      h(MyField, { label: 'fireResist' }, [
        h(MyText, { content: material.fireResist }),
      ]),
      h(MyField, { label: 'chipResist' }, [
        h(MyText, { content: material.chipResist }),
      ])
    );
    result.push(
      h(MyField, { label: 'densty' }, [
        h(MyText, { content: material.density }),
      ]),
      h(MyField, { label: 'breathability' }, [
        h(MyText, { content: material.breathability.translate() }),
      ])
    );
    if (material.windResist) {
      result.push(
        h(MyField, { label: 'windResist' }, [
          h(MyText, { content: material.windResist }),
        ])
      );
    }
    result.push(
      h(MyField, { label: 'specificTeatLiquid' }, [
        h(MyText, { content: material.specificTeatLiquid }),
      ]),
      h(MyField, { label: 'specificHeatSolid' }, [
        h(MyText, { content: material.specificHeatSolid }),
      ]),
      h(MyField, { label: 'latentHeat' }, [
        h(MyText, { content: material.latentHeat }),
      ]),
      h(MyField, { label: 'freezePoint' }, [
        h(MyText, { content: material.freezePoint }),
      ]),
      h(MyField, { label: 'edible' }, [
        h(MyText, { content: material.edible }),
      ]),
      h(MyField, { label: 'rotting' }, [
        h(MyText, { content: material.rotting }),
      ]),
      h(MyField, { label: 'soft' }, [h(MyText, { content: material.soft })]),
      h(MyField, { label: 'reinforces' }, [
        h(MyText, { content: material.reinforces }),
      ]),
      h(MyField, { label: 'sheetThickness' }, [
        h(MyText, { content: material.sheetThickness }),
      ]),
      h(MyField, { label: 'sheetThickness' }, [
        h(MyText, { content: material.sheetThickness }),
      ])
    );
    if (isNotEmpty(material.vitamins)) {
      result.push(
        h(
          MyField,
          { label: 'vitamin', ul: true },
          material.vitamins?.map((vitamin) => {
            return h('li', [
              h(MyText, { content: vitamin[0].value.name }),
              h(MyText, { content: ` (${vitamin[1]})` }),
            ]);
          })
        )
      );
    }
    if (material.fuelData) {
      result.push(
        h(MyField, { label: 'fuel' }, h('dl', material.fuelData?.getView()))
      );
    }
    if (isNotEmpty(material.burnData)) {
      result.push(
        h(
          MyField,
          { label: 'burn', ul: true },
          material.burnData?.map((burn) => {
            return h('li', h('dl', [...burn.getView()]));
          })
        )
      );
    }
    if (isNotEmpty(material.burnProducts)) {
      result.push(
        h(
          MyField,
          { label: 'burnProduct', ul: true },
          material.burnProducts?.map((burnProduct) => {
            return h('li', [
              h(MyText, { content: burnProduct[0].value.name }),
              h(MyText, { content: ` (${burnProduct[1]})` }),
            ]);
          })
        )
      );
    }
    return result;
  }

  public breathability(): number {
    return this.breathabilityToNumber(this.data.breathability.raw);
  }

  private breathabilityToNumber(str: string): number {
    for (const i in BreathabilityRating) {
      const isValueProperty = parseInt(i, 10) >= 0;
      if (!isValueProperty && str === i) {
        return parseInt(BreathabilityRating[i], 10) ?? 0;
      }
    }
    return 0;
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.name = getTranslationString(jsonObject, 'name');

    data.bashResist = getNumber(jsonObject, 'bash_resist');
    data.cutResist = getNumber(jsonObject, 'cut_resist');
    data.bulletResist = getNumber(jsonObject, 'bullet_resist');
    data.acidResist = getNumber(jsonObject, 'acid_resist');
    data.elecResist = getNumber(jsonObject, 'elec_resist');
    data.fireResist = getNumber(jsonObject, 'fire_resist');
    data.chipResist = getNumber(jsonObject, 'chip_resist');

    data.density = getNumber(jsonObject, 'density', 1);
    data.sheetThickness = getNumber(jsonObject, 'sheet_thickness');
    data.windResist = getOptionalNumber(jsonObject, 'wind_resist');

    data.specificHeatSolid = getNumber(
      jsonObject,
      'specific_heat_liquid',
      4.186
    );
    data.specificTeatLiquid = getNumber(
      jsonObject,
      'specific_heat_solid',
      2.108
    );
    data.latentHeat = getNumber(jsonObject, 'latent_heat', 334);
    data.freezePoint = getNumber(jsonObject, 'freezing_point');

    data.breathability = new Translation(
      getString(
        jsonObject,
        'breathability',
        BreathabilityRating.IMPERMEABLE.toString()
      ),
      'breathabilityRating'
    );
    data.salvagedInto = getOptionalAsyncName(
      jsonObject,
      'salvaged_into',
      CddaType.item
    );
    data.repairedWith = getOptionalAsyncName(
      jsonObject,
      'repaired_with',
      CddaType.item
    );
    data.edible = getBoolean(jsonObject, 'edible');
    data.rotting = getBoolean(jsonObject, 'rotting');
    data.soft = getBoolean(jsonObject, 'soft');
    data.reinforces = getBoolean(jsonObject, 'reinforces');
    data.vitamins = getOptionalArray(jsonObject, 'vitamins')?.map(
      (vitaminTulpe) => {
        const temp = vitaminTulpe as [string, number];
        return [new AsyncName(temp[0], CddaType.vitamin), temp[1]];
      }
    );
    data.burnData = getArray(jsonObject, 'burn_data')?.map((burn_data) => {
      return new MaterialBurn(burn_data as object);
    });
    if (isEmpty(data.burnData) && data.fireResist <= 0) {
      data.burnData.push(new MaterialBurn({ burn: 1 }));
    }
    if (jsonObject.hasOwnProperty('fuel_data')) {
      data.fuelData = new Fuel(<object>jsonObject.fuel_data);
    }
    data.burnProducts = getArray(jsonObject, 'burn_products').map(
      (vitaminTulpe) => {
        const temp = vitaminTulpe as [string, number];
        return [new AsyncName(temp[0], CddaType.item), temp[1]];
      }
    );
  }
}

interface MaterialInterface {
  name: string;

  salvagedInto?: AsyncName;
  repairedWith?: AsyncName;

  bashResist: number;
  cutResist: number;
  bulletResist: number;
  acidResist: number;
  elecResist: number;
  fireResist: number;
  chipResist: number;

  density: number;
  breathability: Translation;
  windResist?: number;

  specificTeatLiquid: number;
  specificHeatSolid: number;
  latentHeat: number;

  freezePoint: number;
  edible: boolean;
  rotting: boolean;
  soft: boolean;
  reinforces: boolean;

  sheetThickness: number;
  vitamins?: [AsyncName, number][];
  fuelData?: Fuel;
  burnData: MaterialBurn[];
  burnProducts: [AsyncName, number][];
}
