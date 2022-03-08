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
};

export default mutation;
