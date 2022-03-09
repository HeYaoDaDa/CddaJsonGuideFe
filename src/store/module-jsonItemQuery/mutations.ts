import { MutationTree } from 'vuex';
import { CurrentJsonItem } from './state';

const mutation: MutationTree<CurrentJsonItem> = {
  updateCurrentJsonItem(state: CurrentJsonItem, value: CurrentJsonItem) {
    Object.assign(state, value);
  },
};

export default mutation;
