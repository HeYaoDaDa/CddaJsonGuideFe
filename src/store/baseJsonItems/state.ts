export interface BaseJsonItemInterface {
  materials: JsonItem[];
}

function state(): BaseJsonItemInterface {
  return {
    materials: [],
  };
}

export default state;
