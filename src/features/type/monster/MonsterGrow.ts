export interface MonsterGrowContent {
  upgrades?: {
    age_grow?: number;
    into?: string;
    into_group?: string;
  };
}

export class MonsterGrowFeature {
  age_grow?: number;
  into?: string;
  into_name?: string;
  into_group?: string;

  constructor(jsonItem: JsonItem) {
    const upgradesContent = jsonItem.content as MonsterGrowContent;
    this.age_grow = upgradesContent.upgrades?.age_grow;
    this.into = upgradesContent.upgrades?.into;
    this.into_group = upgradesContent.upgrades?.into_group;
  }
}
