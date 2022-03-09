import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { CurrentJsonItem } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const currentJsonItemQueryModule: Module<CurrentJsonItem, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default currentJsonItemQueryModule;
