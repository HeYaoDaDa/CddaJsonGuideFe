import { reactive } from 'vue';

interface DamageContent {
  damage_type: string;
  amount: number;
  armor_penetration: number;
  armor_multiplier: number;
  damage_multiplier: number;
}

interface AttackEffectContent {
  id: string;
  duration?: number;
  affect_hit_bp?: boolean;
  bp?: string;
  permanent?: boolean;
  chance?: number;
}

interface SpecialAttackContent {
  type?: string;
  id?: string;
  cooldown?: number;
}

interface MonsterAttackContent {
  aggression?: number;
  morale?: number;
  diff?: number;
  attack_cost?: number;
  melee_skill?: number;
  melee_damage?: DamageContent[];

  melee_dice?: number;
  melee_dice_sides?: number;

  hitsize_min?: number;
  hitsize_max?: number;

  grab_strength?: number;
  melee_cut?: number;
  regen_morale?: boolean;

  attack_effs?: AttackEffectContent[];
  special_attacks?: (SpecialAttackContent | [string, number])[];
}

interface MonsterAttackFeature {
  aggression?: number;
  morale?: number;
  diff?: number;
  attack_cost?: number;
  melee_skill?: number;
  //TODO
  melee_damage?: DamageContent[];

  melee_dice?: number;
  melee_dice_sides?: number;

  hitsize_min?: number;
  hitsize_max?: number;

  grab_strength?: number;
  melee_cut?: number;
  regen_morale?: boolean;

  attack_effs?: AttackEffectContent[];
  special_attacks?: (SpecialAttackContent | [string, number])[];
}

export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'monster';
}

export function initMonsterAttackFeature(
  jsonItem: JsonItem
): MonsterAttackFeature {
  const monsterAttackFeature = reactive({} as MonsterAttackFeature);
  const content = <MonsterAttackContent>jsonItem.content;

  monsterAttackFeature.aggression = content.aggression;
  monsterAttackFeature.morale = content.morale;
  monsterAttackFeature.diff = content.diff;
  monsterAttackFeature.attack_cost = content.attack_cost;
  monsterAttackFeature.melee_skill = content.melee_skill;
  //TODO
  return monsterAttackFeature;
}
