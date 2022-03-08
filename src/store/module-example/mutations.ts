import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  selectVersion(
    state: ExampleStateInterface,
    newVersion: { label: string; value: string }
  ) {
    state.config.version = newVersion;
  },
  selectLanguage(
    state: ExampleStateInterface,
    newLanguage: { label: string; value: string }
  ) {
    state.config.language = newLanguage;
  },
  selectMods(state: ExampleStateInterface, newMods: string[]) {
    state.config.mods = newMods;
  },
  updateModOptions(state: ExampleStateInterface, newOptions: SelectOption[]) {
    state.config.modSelectOptions = newOptions;
  },
};

export default mutation;
