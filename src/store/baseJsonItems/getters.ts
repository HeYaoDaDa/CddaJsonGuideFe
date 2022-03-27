import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { BaseJsonItemInterface } from './state';

const getters: GetterTree<BaseJsonItemInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default getters;
