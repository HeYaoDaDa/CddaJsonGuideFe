import { getJsonItemListByJsonId } from 'src/api';
import { Store } from 'src/store';

const jsonItemMap = Store.state.baseJsonItems.jsonItemMap;

export async function getBaseJsonItem(
  jsonType: string,
  jsonId: string
): Promise<JsonItem | undefined> {
  if (jsonItemMap.get(jsonType)?.has(jsonId)) {
    return new Promise((resolve) => {
      resolve(jsonItemMap.get(jsonType)?.get(jsonId));
    });
  } else {
    return getJsonItemListByJsonId(jsonType, jsonId).then((jsonItems) => {
      addBaseJsonItem(jsonItems[0]);
      return jsonItems[0];
    });
  }
}

export function addBaseJsonItem(jsonItem: JsonItem) {
  Store.commit('baseJsonItems/addJsonItem', jsonItem);
}
