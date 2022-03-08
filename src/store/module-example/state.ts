export interface ExampleStateInterface {
  config: {
    version: {
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
    },
  };
}

export default state;
