import { getJsonItemListByJsonId } from 'src/api';
import { Store } from 'src/store';
import { isEmpty } from '.';

const jsonItemMap = Store.state.baseJsonItems.jsonItemMap;

export async function getBaseJsonItem(
  jsonType: string,
  jsonId: string
): Promise<JsonItem[]> {
  if (jsonItemMap.get(jsonType)?.has(jsonId)) {
    return new Promise((resolve) => {
      resolve(jsonItemMap.get(jsonType)?.get(jsonId) ?? []);
    });
  } else {
    return getJsonItemListByJsonId(jsonType, jsonId).then((jsonItems) => {
      if (isEmpty(jsonItems)) {
        console.warn(
          `getJsonItemListByJsonId result is empty,${jsonType}:${jsonId}`
        );
        return [];
      } else {
        addBaseJsonItem(jsonItems);
        return jsonItems;
      }
    });
  }
}

export function addBaseJsonItem(jsonItems: JsonItem[]) {
  Store.commit('baseJsonItems/addJsonItem', jsonItems);
}
