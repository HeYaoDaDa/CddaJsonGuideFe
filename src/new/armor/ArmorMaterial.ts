import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import { getBoolean, getNumber, getString } from '../JsonUtil';
import { CddaType } from '../type';
import MyField from '../components/MyField.vue';
import { SuperData } from '../SuperData';

export class ArmorMaterial extends SuperData<ArmorMaterialInterface> {
  constructor(value: object) {
    super(value);
    if (this.validateValue(value)) {
      this.parseJson(value);
    } else {
      console.warn('ArmorMaterial validate fail, value: %o', value);
    }
  }

  validateValue(value: object): boolean {
    return value.hasOwnProperty('type');
  }

  getView(): VNode[] {
    return [
      h(MyField, {
        label: 'name',
        content: this.data.id.value.name,
        route: this.data.id.route,
      }),
      h(MyField, {
        label: 'coverage',
        content: this.data.coverage,
      }),
      h(MyField, {
        label: 'thickness',
        content: this.data.thickness,
      }),
    ];
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    this.data.id = new AsyncName(
      getString(jsonObject, 'type', ''),
      CddaType.material
    );
    this.data.coverage = getNumber(jsonObject, 'covered_by_mat', 100);
    this.data.thickness = getNumber(jsonObject, 'thickness', 0);
    this.data.ignoreSheetThickness = getBoolean(
      jsonObject,
      'ignore_sheet_thickness',
      false
    );
  }
}
interface ArmorMaterialInterface {
  id: AsyncName;
  coverage: number;
  thickness: number;
  ignoreSheetThickness: boolean;
}
