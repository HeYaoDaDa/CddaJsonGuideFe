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
        label: 'Latest',
        value: 'latest',
      },
      language: {
        label: '',
        value: '',
      },
      mods: ['dda'],
    },
  };
}

export default state;
