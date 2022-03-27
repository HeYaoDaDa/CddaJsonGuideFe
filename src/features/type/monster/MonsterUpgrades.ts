export interface MonsterUpgradesContent {
  upgrades?: {
    half_life?: number;
    into?: string;
    into_group?: string;
  };
}

export class MonsterUpgradesFeature {
  half_life?: number;
  into?: string;
  into_name?: string;
  into_group?: string;

  constructor(jsonItem: JsonItem) {
    const upgradesContent = jsonItem.content as MonsterUpgradesContent;
    this.half_life = upgradesContent.upgrades?.half_life;
    this.into = upgradesContent.upgrades?.into;
    this.into_group = upgradesContent.upgrades?.into_group;
  }
}
