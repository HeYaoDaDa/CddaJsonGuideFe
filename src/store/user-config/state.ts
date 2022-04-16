import { Cookies } from 'quasar';
import { isNotEmpty } from 'src/utils';
import { languageOptions } from '../../constant';

export interface UserConfigInterface {
  language: SelectOption;
  version: Version;
  mods: Mod[];
}

function state(): UserConfigInterface {
  return {
    language: initLanguage(),
    version: {
      id: Cookies.get('version') ?? 'latest',
      releaseId: '',
      releaseDescribe: '',
      targetCommit: '',
      branch: 0,
      createDate: new Date(),
      publishDate: new Date(),
      tagName: '',
      tagMessage: '',
      tagDate: new Date(),
    },
    mods: initMods(),
  };
}

function initLanguage(): SelectOption {
  const value = Cookies.get('language') ?? 'en-US';
  return (
    languageOptions.find(
      (languageOption) => value === languageOption.value
    ) ?? {
      label: '',
      value: value,
    }
  );
}

function initMods(): Mod[] {
  const modIds: string[] = Cookies.get('mods');
  if (isNotEmpty(modIds)) {
    return modIds.map((modId) => {
      return { id: modId } as Mod;
    });
  } else {
    return [{ id: 'dda' } as Mod];
  }
}

export default state;
