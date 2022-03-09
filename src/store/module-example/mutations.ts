import { Cookies } from 'quasar';
import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  selectVersion(
    state: ExampleStateInterface,
    newVersion: { label: string; value: string }
  ) {
    state.config.version = newVersion;
    Cookies.set('version', newVersion.value, { expires: 30 });
  },
  selectLanguage(
    state: ExampleStateInterface,
    newLanguage: { label: string; value: string }
  ) {
    state.config.language = newLanguage;
    Cookies.set('language', newLanguage.value, { expires: 30 });
  },
  selectMods(state: ExampleStateInterface, newMods: string[]) {
    state.config.mods = newMods;
    Cookies.set('mods', JSON.stringify(newMods), { expires: 30 });
  },
  updateModOptions(state: ExampleStateInterface, newOptions: SelectOption[]) {
    state.config.modSelectOptions = newOptions;
  },
  updateJsonTypeTree(state: ExampleStateInterface, val: TypeTreeNode[]) {
    state.config.jsonTypeTree = val;
  },
};

export default mutation;
