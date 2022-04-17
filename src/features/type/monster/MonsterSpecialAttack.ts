import { IdNameHelpInterface } from 'src/type';
import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { initIdNameHelpInterfaces } from 'src/utils/DataUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';
import {
  DamageInstance,
  DamageInstanceJsonObject,
  initDamageInstanceByJsonObjects,
} from '../other/Damage';
import {
  initMonsterAttackEffectFeatures,
  MonsterAttackEffectContent,
  MonsterAttackEffectFeature,
} from '../other/MonsterAttackEffect';

interface MonsterSpecialAttackContent {
  cooldown?: number;
  damage_max_instance?: DamageInstanceJsonObject[];

  min_mul?: number;
  max_mul?: number;

  move_cost?: number;
  accuracy?: number;
  body_parts?: string[];
  attack_chance?: number;
  attack_upper?: boolean;
  range?: number;

  hitsize_min?: number;
  hitsize_max?: number;

  no_adjacent?: boolean;
  effects?: MonsterAttackEffectContent[];
  throw_strength?: number;
}

interface MonsterSpecialAttackFeature {
  cooldown?: number;
  damageMaxInstance?: DamageInstance[];

  minMul?: number;
  maxMul?: number;

  moveCost: number;
  accuracy?: number;
  bodyParts?: IdNameHelpInterface[];
  attackChance?: number;
  attackUpper: boolean;
  range?: number;

  hitsizeMin?: number;
  hitsizeMax?: number;

  noAdjacent: boolean;
  effects?: MonsterAttackEffectFeature[];
  throwStrength?: number;
}
function initBodyParts(bps: string[]): IdNameHelpInterface[] {
  const result = reactive(initIdNameHelpInterfaces(bps));
  result.forEach((bodyPart) => {
    void getBaseJsonItem('body_part', bodyPart.id).then((jsonItems) => {
      if (isNotEmpty(jsonItems)) {
        bodyPart.name = getName(jsonItems);
      }
    });
  });
  return result;
}

export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'monster_attack';
}

export function initMonsterSpecialAttackFeature(
  jsonItem: JsonItem
): MonsterSpecialAttackFeature {
  const monsterAttackFeature = reactive({} as MonsterSpecialAttackFeature);
  const content = <MonsterSpecialAttackContent>jsonItem.content;

  monsterAttackFeature.cooldown = content.cooldown;
  monsterAttackFeature.damageMaxInstance = initDamageInstanceByJsonObjects(
    content.damage_max_instance
  );
  monsterAttackFeature.minMul = content.min_mul;
  monsterAttackFeature.maxMul = content.max_mul;
  monsterAttackFeature.moveCost = content.move_cost ?? 100;
  monsterAttackFeature.accuracy = content.accuracy;
  if (content.body_parts) {
    monsterAttackFeature.bodyParts = initBodyParts(content.body_parts);
  }
  monsterAttackFeature.attackChance = content.attack_chance;
  monsterAttackFeature.attackUpper = content.attack_upper ?? false;
  monsterAttackFeature.range = content.range;

  monsterAttackFeature.hitsizeMin = content.hitsize_min;
  monsterAttackFeature.hitsizeMax = content.hitsize_max;

  monsterAttackFeature.noAdjacent = content.no_adjacent ?? false;
  monsterAttackFeature.range = content.range;
  if (content.effects) {
    monsterAttackFeature.effects = initMonsterAttackEffectFeatures(
      content.effects
    );
  }
  monsterAttackFeature.throwStrength = content.throw_strength;

  return monsterAttackFeature;
}
