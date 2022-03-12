import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserConfigInterface } from './state';

const getters: GetterTree<UserConfigInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default getters;
