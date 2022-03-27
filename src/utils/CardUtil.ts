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

interface ArmorInterface {
  encumbrance?: number | number[];
  coverage?: number;
  cover_melee?: number;
  cover_ranged?: number;
  cover_vitals?: number;
  covers?: string[];
  specifically_covers?: string[];
  material?: {
    type?: string;
    covered_by_mat?: number;
    thickness?: number;
  }[];
}
interface ArmorItemInterface {
  armor?: ArmorInterface[];
}

export function parserArmorItem(
  jsonObject: object
): ArmorItemInterface | undefined {
  const armorItem = jsonObject as ArmorItemInterface;
  if (armorItem && armorItem.armor) {
    return armorItem;
  } else {
    return undefined;
  }
}

interface ToHitInterface {
  grip: string;
  length: string;
  surface: string;
  balance: string;
}
interface AttackItemInterface {
  weapon_category?: string | string[];
  bashing?: number;
  cutting?: number;
  piercing?: number;
  to_hit?: number | ToHitInterface;
  volume?: string | number;
  weight?: string | number;
  baseMovesPerAttack: number;
}

import { isItem } from 'src/utils/JsonItemUtil';
import { parseVolumeToMl, parseWeightToG } from 'src/utils/DataUtil';

export function parserAttackItem(
  jsonItem: JsonItem
): AttackItemInterface | undefined {
  const attackItem = jsonItem.content as AttackItemInterface;
  if (attackItem && isItem(jsonItem.type)) {
    setDefault(attackItem, 'bashing', 0);
    setDefault(attackItem, 'cutting', 0);
    setDefault(attackItem, 'piercing', 0);
    setDefault(attackItem, 'to_hit', 0);
    setDefault(attackItem, 'volume', 0);
    setDefault(attackItem, 'weight', 0);
    if (attackItem.volume && attackItem.weight) {
      attackItem.baseMovesPerAttack =
        65 +
        Math.floor(parseVolumeToMl(attackItem.volume) / 62.5) +
        Math.floor(parseWeightToG(attackItem.weight) / 60);
    }
    return attackItem;
  } else {
    return undefined;
  }
}

interface FlagsItem {
  flags?: string[];
}

export function parserFlagsItem(jsonItem: JsonItem): FlagsItem | undefined {
  const flagsItem = jsonItem.content as FlagsItem;
  if (flagsItem && flagsItem.flags) {
    return flagsItem;
  } else {
    return undefined;
  }
}

interface GeneralItem {
  material?: string | string[];
  volume?: string;
  weight?: string;
  length?: string;
  category?: string;
}

export function parserGeneralItem(jsonItem: JsonItem): GeneralItem | undefined {
  const generalItem = jsonItem.content as GeneralItem;
  if (generalItem && isItem(jsonItem.type)) {
    setDefault(generalItem, 'volume', '');
    setDefault(generalItem, 'weight', '');
    setDefault(generalItem, 'length', '37 cm');
    return generalItem;
  } else {
    return undefined;
  }
}

export function getObjectString(json: object | string): string {
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

function setDefault<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  def: T[K]
) {
  if (!obj[key]) {
    obj[key] = def;
  }
}
