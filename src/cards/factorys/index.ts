import { CardFactoryInterface } from 'src/type';
import { MonsterGrowFactory } from './MonsterGrowFactory';
import { MonsterUpgradesFactory } from './MonsterUpgradesFactory';

export const factorys = new Map<string, CardFactoryInterface>()
  .set('upgrades', new MonsterUpgradesFactory())
  .set('monsterGrow', new MonsterGrowFactory());
