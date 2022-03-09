import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CurrentJsonItem } from './state';

const actions: ActionTree<CurrentJsonItem, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
