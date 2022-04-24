import {
  getNotEmptyJsonItems,
  getNotEmptyJsonItemsByAsyncName,
} from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';
import { RouteLocationRaw } from 'vue-router';

export class AsyncName {
  value: { id: string; name: string };
  type: string;
  route: RouteLocationRaw;
  constructor(id: string, type: string) {
    this.value = reactive({ id: id, name: id });
    this.type = type;
    this.route = {
      name: 'jsonItem',
      params: {
        jsonType: type,
        jsonId: id,
      },
    };
    this.asyncUpdateName(id, type);
  }
  private asyncUpdateName(id: string, type: string) {
    getNotEmptyJsonItems(type, id)
      .then((jsonItems) => {
        this.value.name = getName(jsonItems);
      })
      .catch(() =>
        console.error(`error in asyncUpdateName type is ${type}, id is ${id}`)
      );
  }
  async getJsonItems(): Promise<JsonItem[]> {
    return await getNotEmptyJsonItemsByAsyncName(this);
  }
}

export function generateAsyncNames(ids: string[], type: string): AsyncName[] {
  const result: AsyncName[] = reactive([]);
  ids.forEach((id) => result.push(new AsyncName(id, type)));
  return result;
}

export function hasAsyncName(
  array: Array<AsyncName>,
  value: AsyncName | string
): boolean {
  const stringValue = typeof value === 'string' ? value : value.value.id;
  return array.some((item) => item.value.id === stringValue);
}
