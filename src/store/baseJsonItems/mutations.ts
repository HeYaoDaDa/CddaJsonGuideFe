import { MutationTree } from 'vuex';
import { BaseJsonItemInterface } from './state';

const mutation: MutationTree<BaseJsonItemInterface> = {
  addJsonItem({ jsonItemMap }, jsonItem: JsonItem) {
    if (jsonItemMap.has(jsonItem.type)) {
      jsonItemMap.get(jsonItem.type)?.set(jsonItem.jsonId, jsonItem);
    } else {
      const tempJsonItemMap = new Map<string, JsonItem>();
      tempJsonItemMap.set(jsonItem.jsonId, jsonItem);
      jsonItemMap.set(jsonItem.type, tempJsonItemMap);
    }
  },
  clearJsonItemMap({ jsonItemMap }) {
    console.debug('clear old jsonItemMap');
    jsonItemMap.clear();
  },
};

export default mutation;
