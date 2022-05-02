import { i18n } from 'src/boot/i18n';
import MyText from 'src/new/components/MyText/MyText.vue';
import { parseItemToS, TimeToString } from 'src/utils/DataUtil';
import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import {
  getBoolean,
  getNumber,
  getOptionalAsyncName,
  getOptionalUnknown,
} from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';

export class RecipeProficiency extends SuperData<RecipeProficiencyInterface> {
  constructor(value: object | undefined) {
    super(value);
    if (value && this.validateValue(value)) {
      this.parseJson(value);
    }
  }

  validateValue(value: object): boolean {
    return value.hasOwnProperty('proficiency');
  }

  getView(): VNode[] {
    const result: VNode[] = [];
    const data = this.data;

    result.push(
      h('li', {}, () => {
        const result = [
          h(MyText, { content: data.name.getName(), route: data.name.route }),
        ];
        if (data.required) {
          result.push(
            h(MyText, { content: `(${i18n.global.t('label.required')})` })
          );
        }
        if (data.timeMultiplier > 1) {
          result.push(
            h(MyText, {
              content: `(${data.timeMultiplier}x${i18n.global.t(
                'label.time'
              )})`,
            })
          );
        }
        if (data.failMultiplier > 1) {
          result.push(
            h(MyText, {
              content: `(${data.failMultiplier}x${i18n.global.t(
                'label.fail'
              )})`,
            })
          );
        }
        if (data.learningTimeMultiplier > 1) {
          result.push(
            h(MyText, {
              content: `(${data.learningTimeMultiplier}x${i18n.global.t(
                'label.learningTime'
              )})`,
            })
          );
        }
        if (data.maxExperience) {
          result.push(
            h(MyText, {
              content: `(${TimeToString(data.maxExperience)} ${i18n.global.t(
                'label.maxExperience'
              )})`,
            })
          );
        }
        return result;
      })
    );

    return result;
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.name =
      getOptionalAsyncName(jsonObject, 'proficiency', CddaType.proficiency) ??
      <AsyncName>{};
    data.required = getBoolean(jsonObject, 'required');
    data.timeMultiplier = getNumber(jsonObject, 'time_multiplier');
    data.failMultiplier = getNumber(jsonObject, 'fail_multiplier');
    data.learningTimeMultiplier = getNumber(
      jsonObject,
      'learning_time_multiplier',
      1
    );
    const temp = getOptionalUnknown(jsonObject, 'max_experience');
    if (temp) {
      if (typeof temp === 'number') {
        data.maxExperience = temp * 100;
      } else if (typeof temp === 'string') {
        data.maxExperience = parseItemToS(temp);
      }
    }
  }
}

interface RecipeProficiencyInterface {
  name: AsyncName;
  required: boolean;
  timeMultiplier: number;
  failMultiplier: number;
  learningTimeMultiplier: number;
  maxExperience?: number;
}
