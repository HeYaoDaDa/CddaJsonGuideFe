import { Cookies } from 'quasar';
import { MutationTree } from 'vuex';
import { UserConfigInterface } from './state';

const mutation: MutationTree<UserConfigInterface> = {
  selectLanguage(state: UserConfigInterface, newLanguage: SelectOption) {
    state.language = newLanguage;
    Cookies.set('language', newLanguage.value, { expires: 30 });
  },
  selectVersion(state: UserConfigInterface, newVersion: Version) {
    state.version = newVersion;
    Cookies.set('version', newVersion.id, { expires: 30 });
  },
  selectMods(state: UserConfigInterface, newMods: Mod[]) {
    state.mods = newMods;
    Cookies.set('mods', JSON.stringify(newMods.map((mod) => mod.id)), {
      expires: 30,
    });
  },
  updateJsonTypeTree(state: UserConfigInterface, val: TypeTreeNode[]) {
    state.jsonTypeTree = val;
  },
};

export default mutation;
