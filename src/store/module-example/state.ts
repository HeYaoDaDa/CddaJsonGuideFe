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
    },
  };
}

export default state;
