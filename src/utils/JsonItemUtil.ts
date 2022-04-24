import { itemTypes } from 'src/constant';
import { CddaType } from 'src/new/type';
import { Store } from 'src/store';

export function isItem(jsonType: string): boolean {
  return itemTypes.includes(jsonType);
}

export function getName(jsonItems: JsonItem | JsonItem[]): string {
  const jsonItem = jsonItems instanceof Array ? jsonItems[0] : jsonItems;
  if (jsonItem.type === CddaType.flag) {
    return (<{ info: string }>jsonItem.content).info;
  }
  return (
    getObjectString((<{ name: object | string }>jsonItem.content).name) ??
    jsonItem.jsonId
  );
}

export function getModName(modId: string) {
  const modName = Store.state.userConfig.mods.find(
    (mod) => mod.id == modId
  )?.name;
  return modName ? modName : modId;
}

export function getObjectString(json: object | string): string | undefined {
  const nameObject = json as
    | string
    | string[]
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
      if (nameObject instanceof Array) {
        return nameObject.join('/');
      }
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
    return undefined;
  }
}
