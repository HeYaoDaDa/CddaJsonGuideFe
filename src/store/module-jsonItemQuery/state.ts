export interface CurrentJsonItem {
  jsonId: string;
  type: string;
  isOriginal: boolean;
}

function state(): CurrentJsonItem {
  return {
    jsonId: '',
    type: '',
    isOriginal: false,
  };
}

export default state;
