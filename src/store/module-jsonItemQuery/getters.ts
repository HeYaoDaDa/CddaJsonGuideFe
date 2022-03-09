import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CurrentJsonItem } from './state';

const getters: GetterTree<CurrentJsonItem, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default getters;
