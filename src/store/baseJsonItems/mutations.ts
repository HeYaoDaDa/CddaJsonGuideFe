import { MutationTree } from 'vuex';
import { BaseJsonItemInterface } from './state';

const mutation: MutationTree<BaseJsonItemInterface> = {
  updateMaterials(state: BaseJsonItemInterface, newMaterials: JsonItem[]) {
    state.materials = newMaterials;
  },
};

export default mutation;
