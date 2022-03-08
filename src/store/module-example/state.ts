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
        value: '',
      },
      language: {
        label: '',
        value: '',
      },
      mods: [],
      modSelectOptions: [],
      jsonTypeTree: [],
    },
  };
}

export default state;
