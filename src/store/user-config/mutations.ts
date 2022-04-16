import { Cookies } from 'quasar';
import { isNotEmpty } from 'src/utils';
import { MutationTree } from 'vuex';
import { UserConfigInterface } from './state';

const mutation: MutationTree<UserConfigInterface> = {
  selectLanguage(state: UserConfigInterface, newLanguage: SelectOption) {
    state.language = newLanguage;
    Cookies.set('language', newLanguage.value, { expires: 365 });
  },
  updateVersionsInfo({ version }, latestVersions: Version[]) {
    console.group(
      'mutation updateVersionsInfo start, version is %o, latestVersions is %o',
      version,
      latestVersions
    );
    if (isNotEmpty(latestVersions)) {
      const latestVersion = latestVersions.find((v) => version.id === v.id);
      if (latestVersion) {
        console.debug(
          'mutation updateVersionsInfo find latestVersion: %o',
          latestVersion
        );
        version.branch = latestVersion.branch;
        version.createDate = latestVersion.createDate;
        version.publishDate = latestVersion.publishDate;
        version.releaseDescribe = latestVersion.releaseDescribe;
        version.releaseId = latestVersion.releaseId;
        version.tagDate = latestVersion.tagDate;
        version.tagMessage = latestVersion.tagMessage;
        version.tagName = latestVersion.tagName;
        version.targetCommit = latestVersion.targetCommit;
      }
    }
    console.groupEnd();
  },
  selectVersion(state: UserConfigInterface, newVersion: Version) {
    state.version = newVersion;
    Cookies.set('version', newVersion.id, { expires: 30 });
  },
  updateModsInfo({ mods }, latestMods: Mod[]) {
    console.group(
      'mutation updateModsInfo start, mods is %o, latestMods is %o',
      mods,
      latestMods
    );
    if (isNotEmpty(mods) && isNotEmpty(latestMods)) {
      mods.forEach((mod) => {
        const latestMod = latestMods.find((v) => mod.id === v.id);
        if (latestMod) {
          console.debug(
            'mutation updateModsInfo find latestMod: %o',
            latestMod
          );
          mod.category = latestMod.category;
          mod.description = latestMod.description;
          mod.name = latestMod.name;
        }
      });
    }
    console.groupEnd();
  },
  selectMods(state: UserConfigInterface, newMods: Mod[]) {
    state.mods = newMods;
    Cookies.set('mods', JSON.stringify(newMods.map((mod) => mod.id)), {
      expires: 30,
    });
  },
};

export default mutation;
