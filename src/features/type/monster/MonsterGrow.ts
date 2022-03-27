import { getJsonItemListByJsonId } from 'src/api';
import { getModName, getName } from 'src/utils/JsonItemUtil';

export interface MonsterGrowContent {
  upgrades?: {
    age_grow?: number;
    into?: string;
    into_group?: string;
  };
}

export class MonsterGrowFeature {
  name: string;
  mod: string;
  age_grow?: number;
  into?: string;
  into_group?: string;

  constructor(jsonItem: JsonItem) {
    const upgradesContent = jsonItem.content as MonsterGrowContent;
    this.name = getName(jsonItem);
    this.mod = getModName(jsonItem.mod);
    this.age_grow = upgradesContent.upgrades?.age_grow;
    this.into = upgradesContent.upgrades?.into;
    this.into_group = upgradesContent.upgrades?.into_group;
    if (upgradesContent.upgrades?.into) {
      void getJsonItemListByJsonId(
        'monster',
        upgradesContent.upgrades?.into
      ).then((jsonItems) => {
        if (jsonItems && jsonItems.length > 0) {
          this.into = getName(jsonItems[0]);
        }
      });
    }
  }
}
