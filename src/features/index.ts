import { FeatureFactoryInterface } from 'src/type';
import { AttackFactory } from './handler/item/AttackHandler';
import { ReproductionFactory } from './handler/item/ReproductionHandle';
import { MonsterGrowFactory } from './handler/monster/MonsterGrowHandler';
import { MonsterUpgradesFactory } from './handler/monster/MonsterUpgradesHandler';

export const featureFactorys = new Map<string, FeatureFactoryInterface>()
  .set('monsterUpgrades', new MonsterUpgradesFactory())
  .set('monsterGrow', new MonsterGrowFactory())
  .set('attack', new AttackFactory())
  .set('monsterGrow', new ReproductionFactory());
