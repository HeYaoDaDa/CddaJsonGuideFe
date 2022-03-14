interface AllItemInterface {
  name?: string | object;
  description?: string | object;
  symbol?: string;
}
export function parserAllItem(
  jsonObject: object
): AllItemInterface | undefined {
  if (jsonObject) {
    return jsonObject as AllItemInterface;
  } else {
    return undefined;
  }
}

export function getObjectString(json: object): string {
  const nameObject = json as
    | string
    | {
        str?: string;
        str_sp?: string;
        str_pl?: string;
        male?: string;
        female?: string;
      };
  if (nameObject) {
    if (typeof nameObject == 'string') {
      return nameObject as unknown as string;
    } else if (typeof json == 'object') {
      if (nameObject.str) {
        return nameObject.str;
      } else if (nameObject.str_sp) {
        return nameObject.str_sp;
      } else if (nameObject.str_pl) {
        return nameObject.str_pl;
      } else if (nameObject.male) {
        return nameObject.male;
      } else if (nameObject.female) {
        return nameObject.female;
      } else {
        console.error('no find name in', json);
        return '';
      }
    } else {
      console.error('no find name, type is wrong, ', typeof json);
      return '';
    }
  } else {
    console.error('no find name, json is null');
    return '';
  }
}
