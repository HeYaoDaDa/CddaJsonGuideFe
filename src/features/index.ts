import { AttackFactory } from './handler/item/AttackHandler';
import { ReproductionFactory } from './handler/monster/ReproductionHandle';
import { MonsterGrowFactory } from './handler/monster/MonsterGrowHandler';
import { MonsterUpgradesFactory } from './handler/monster/MonsterUpgradesHandler';

export const featureFactorys = [
  new MonsterUpgradesFactory(),
  new MonsterGrowFactory(),
  new AttackFactory(),
  new ReproductionFactory(),
];
