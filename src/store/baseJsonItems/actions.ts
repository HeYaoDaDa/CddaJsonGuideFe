import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { BaseJsonItemInterface } from './state';

const actions: ActionTree<BaseJsonItemInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
