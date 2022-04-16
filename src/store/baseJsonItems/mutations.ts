import { pushItem } from 'src/utils/DataUtil';
import { MutationTree } from 'vuex';
import { BaseJsonItemInterface } from './state';

const mutation: MutationTree<BaseJsonItemInterface> = {
  addJsonItem({ jsonItemMap }, jsonItems: JsonItem[]) {
    jsonItems.forEach((jsonItem) => {
      let jsonTypeMap = jsonItemMap.get(jsonItem.type);
      if (jsonTypeMap) {
        jsonTypeMap.set(
          jsonItem.jsonId,
          pushItem(jsonTypeMap.get(jsonItem.jsonId), jsonItem)
        );
      } else {
        jsonTypeMap = new Map<string, JsonItem[]>();
        jsonTypeMap.set(
          jsonItem.jsonId,
          pushItem(jsonTypeMap.get(jsonItem.jsonId), jsonItem)
        );
        jsonItemMap.set(jsonItem.type, jsonTypeMap);
      }
    });
  },
  clearJsonItemMap({ jsonItemMap }) {
    console.debug('clear old jsonItemMap');
    jsonItemMap.clear();
  },
};

export default mutation;
