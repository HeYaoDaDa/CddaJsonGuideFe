import {
  getJsonItemListByJsonId,
  getJsonItemsByItemType,
  searchJsonItem,
} from './jsonItem';
import { getVersions } from './version';

export {
  getJsonItemListByJsonId,
  getJsonItemsByItemType,
  searchJsonItem,
  getVersions,
};

export function getModsOptions() {
  return getJsonItemsByItemType('mod_info', undefined, undefined, undefined, [
    'all',
  ]).then((response: JsonItem[]) => {
    return response.map((mod) => {
      const modJson = mod.content as {
        name: string;
        description: string;
        category: string;
      };
      return {
        id: mod.jsonId,
        name: modJson.name,
        description: modJson.description,
        category: modJson.category,
      };
    });
  });
}
