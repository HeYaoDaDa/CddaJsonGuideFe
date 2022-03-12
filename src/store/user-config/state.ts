import { Cookies } from 'quasar';

export interface UserConfigInterface {
  language: SelectOption;
  version: Version;
  mods: Mod[];
  jsonTypeTree: TypeTreeNode[];
}

function state(): UserConfigInterface {
  return {
    language: {
      label: '',
      value: Cookies.get('language') ? Cookies.get('language') : 'en-US',
    },
    version: {
      id: '',
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
    mods: [],
    jsonTypeTree: [],
  };
}

export default state;
