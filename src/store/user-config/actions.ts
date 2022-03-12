import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserConfigInterface } from './state';

const actions: ActionTree<UserConfigInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
