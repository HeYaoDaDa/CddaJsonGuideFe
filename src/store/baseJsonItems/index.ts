import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { BaseJsonItemInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const baseJsonItemModule: Module<BaseJsonItemInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default baseJsonItemModule;
