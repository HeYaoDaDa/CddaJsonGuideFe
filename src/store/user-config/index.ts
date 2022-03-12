import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { UserConfigInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const configModule: Module<UserConfigInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default configModule;
