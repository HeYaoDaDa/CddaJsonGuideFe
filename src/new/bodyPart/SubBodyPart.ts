import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import MyField from '../components/MyField.vue';
import MyText from '../components/MyText/MyText.vue';
import {
  getBoolean,
  getNumber,
  getOptionalAsyncName,
  getOptionalString,
  getString,
} from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';

export class SubBodyPart extends SuperData<SubBodyPartInterface> {
  constructor(value: JsonItem | undefined) {
    super(value);
    if (value && this.validateValue(value)) {
      this.parseJson(value.content);
    }
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.subBodyPart;
  }

  getView(): VNode[] {
    const data = this.data;
    const result: VNode[] = [];

    result.push(
      h(MyField, { label: 'parent' }, () => [
        h(MyText, { content: data.parent.getName() }),
      ]),
      h(MyField, { label: 'secondary' }, () => [
        h(MyText, { content: data.secondary }),
      ]),
      h(MyField, { label: 'maxCoverage' }, () => [
        h(MyText, { content: data.maxCoverage }),
      ]),
      h(MyField, { label: 'side' }, () => [h(MyText, { content: data.side })])
    );
    if (data.nameMultiple) {
      result.push(
        h(MyField, { label: 'nameMultiple' }, () => [data.nameMultiple])
      );
    }
    if (data.opposite) {
      result.push(
        h(MyField, { label: 'opposite' }, () => [
          h(MyText, { content: data.opposite }),
        ])
      );
    }

    return result;
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.parent =
      getOptionalAsyncName(jsonObject, 'parent', CddaType.bodyPart) ??
      <AsyncName>{};
    data.secondary = getBoolean(jsonObject, 'secondary');
    data.maxCoverage = getNumber(jsonObject, 'max_coverage');
    data.side = getString(jsonObject, 'side', 'both');
    data.nameMultiple = getOptionalString(jsonObject, 'name_multiple');
    data.opposite = getOptionalAsyncName(
      jsonObject,
      'opposite',
      CddaType.subBodyPart
    );
  }
}

interface SubBodyPartInterface {
  parent: AsyncName;
  secondary: boolean;
  maxCoverage: number;
  side: string;
  nameMultiple?: string;
  opposite?: AsyncName;
}
