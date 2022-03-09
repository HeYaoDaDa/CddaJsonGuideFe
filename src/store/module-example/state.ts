import { Cookies } from 'quasar';

export interface ExampleStateInterface {
  config: {
    version: {
      label: string;
      value: string;
    };
    language: {
      label: string;
      value: string;
    };
    mods: string[];
    modSelectOptions: SelectOption[];
    jsonTypeTree: TypeTreeNode[];
  };
}

function state(): ExampleStateInterface {
  return {
    config: {
      version: {
        label: '',
        value: Cookies.get('version'),
      },
      language: {
        label: '',
        value: Cookies.get('language'),
      },
      mods: Cookies.get('mods') as [],
      modSelectOptions: [],
      jsonTypeTree: [],
    },
  };
}

export default state;
