export interface BaseJsonItemInterface {
  jsonItemMap: Map<string, Map<string, JsonItem>>;
}

function state(): BaseJsonItemInterface {
  return {
    jsonItemMap: new Map(),
  };
}

export default state;
