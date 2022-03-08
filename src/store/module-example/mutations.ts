import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  selectVersion(
    state: ExampleStateInterface,
    newVersion: { label: string; value: string }
  ) {
    state.config.version = newVersion;
  },
};

export default mutation;
