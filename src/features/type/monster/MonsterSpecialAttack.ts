import { i18n } from 'src/boot/i18n';
import { IdNameHelpInterface } from 'src/type';
import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import {
  initIdNameHelpInterface,
  initIdNameHelpInterfaces,
} from 'src/utils/DataUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

interface DamageContent {
  damage_type: string;
  amount: number;
  armor_penetration?: number;
  armor_multiplier?: number;
  damage_multiplier?: number;
}
interface Damage {
  damageType: IdNameHelpInterface;
  amount: number;
  armorPenetration?: number;
  armorMultiplier?: number;
  damageMultiplier?: number;
}
function initDamage(content: DamageContent) {
  const damage = reactive({} as Damage);
  damage.damageType = reactive(initIdNameHelpInterface(content.damage_type));
  damage.damageType.name = i18n.global.t('damageType.' + content.damage_type);
  damage.amount = content.amount;
  damage.armorPenetration = content.armor_penetration;
  damage.armorMultiplier = content.armor_multiplier;
  damage.damageMultiplier = content.damage_multiplier;
  return damage;
}

interface AttackEffectContent {
  id: string;
  duration?: number;
  affect_hit_bp?: boolean;
  bp?: string;
  permanent?: boolean;
  chance?: number;
}
interface AttackEffect {
  id: string;
  name: string;
  duration?: number;
  affect_hit_bp: boolean;
  bp?: string;
  permanent: boolean;
  chance?: number;
}
function initAttackEffect(content: AttackEffectContent) {
  const effect = reactive({} as AttackEffect);
  effect.id = content.id;
  effect.name = content.id;
  void getBaseJsonItem('effect_type', effect.id).then((jsonItems) => {
    if (isNotEmpty(jsonItems)) {
      effect.name = getName(jsonItems);
    }
  });
  effect.duration = content.duration;
  effect.affect_hit_bp = content.affect_hit_bp ?? false;
  effect.bp = content.bp;
  effect.permanent = content.permanent ?? false;
  effect.chance = content.chance;
  return effect;
}

interface MonsterSpecialAttackContent {
  cooldown?: number;
  damage_max_instance?: DamageContent[];

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
  effects?: AttackEffectContent[];
  throw_strength?: number;
}

interface MonsterSpecialAttackFeature {
  cooldown?: number;
  damageMaxInstance?: Damage[];

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
  effects?: AttackEffect[];
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
  monsterAttackFeature.damageMaxInstance = content.damage_max_instance?.map(
    (damage) => initDamage(damage)
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
  monsterAttackFeature.effects = content.effects?.map((effect) =>
    initAttackEffect(effect)
  );
  monsterAttackFeature.throwStrength = content.throw_strength;

  return monsterAttackFeature;
}
