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
    },
  };
}

export default state;
