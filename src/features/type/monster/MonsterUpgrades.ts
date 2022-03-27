import { getJsonItemListByJsonId } from 'src/api';
import { getModName, getName } from 'src/utils/JsonItemUtil';

export interface MonsterUpgradesContent {
  upgrades?: {
    half_life?: number;
    into?: string;
    into_group?: string;
  };
}

export class MonsterUpgradesFeature {
  name: string;
  mod: string;
  half_life?: number;
  into?: string;
  into_group?: string;

  constructor(jsonItem: JsonItem) {
    const upgradesContent = jsonItem.content as MonsterUpgradesContent;
    this.name = getName(jsonItem);
    this.mod = getModName(jsonItem.mod);
    this.half_life = upgradesContent.upgrades?.half_life;
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
