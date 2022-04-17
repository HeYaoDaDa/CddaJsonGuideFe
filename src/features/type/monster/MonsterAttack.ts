import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
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

interface SpecialAttackContent {
  type?: string;
  attack_type?: string;
  id?: string;
  cooldown?: number;
}

interface SpecialAttackFeature {
  type: string;
  id?: string;
  cooldown?: number;
}

interface MonsterAttackContent {
  aggression?: number;
  morale?: number;
  regen_morale?: boolean;

  diff?: number;
  attack_cost?: number;
  melee_skill?: number;
  grab_strength?: number;
  bash_skill?: number;

  melee_damage?: DamageInstanceJsonObject[];
  melee_dice?: number;
  melee_dice_sides?: number;
  attack_effs?: MonsterAttackEffectContent[];
  special_attacks?: (SpecialAttackContent | [string, number])[];

  starting_ammo?: object;
  melee_cut?: number;
}

interface MonsterAttackFeature {
  aggression: number;
  morale: number;
  regenMorale: boolean;

  diff: number;
  attackCost: number;
  meleeSkill: number;
  grabStrength: number;
  bashSkill?: number;

  meleeDamage: DamageInstance[];
  meleeDice: number;
  meleeDiceSides: number;
  attackEffects?: MonsterAttackEffectFeature[];
  specialAttacks?: SpecialAttackFeature[];

  startingAmmo?: { id: string; name: string; amount: number }[];
}

export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'monster';
}

export function initMonsterAttackFeature(
  jsonItem: JsonItem
): MonsterAttackFeature {
  const monsterAttackFeature = reactive({} as MonsterAttackFeature);
  const content = <MonsterAttackContent>jsonItem.content;

  monsterAttackFeature.aggression = content.aggression ?? 0;
  monsterAttackFeature.morale = content.morale ?? 0;
  monsterAttackFeature.regenMorale = content.regen_morale ?? false;

  monsterAttackFeature.diff = content.diff ?? 0;
  monsterAttackFeature.attackCost = content.attack_cost ?? 100;
  monsterAttackFeature.meleeSkill = content.melee_skill ?? 0;
  monsterAttackFeature.grabStrength = content.grab_strength ?? 1;
  monsterAttackFeature.bashSkill = content.bash_skill;

  monsterAttackFeature.meleeDamage = initDamageInstanceByJsonObjects(
    content.melee_damage
  );
  monsterAttackFeature.meleeDice = content.melee_dice ?? 0;
  monsterAttackFeature.meleeDiceSides = content.melee_dice_sides ?? 0;
  monsterAttackFeature.attackEffects = initMonsterAttackEffectFeatures(
    content.attack_effs
  );

  if (content.special_attacks) {
    monsterAttackFeature.specialAttacks = reactive([]);
    content.special_attacks.forEach((json) => {
      let attackContent: SpecialAttackContent;
      if (json instanceof Array) {
        attackContent = {
          type: 'monster_attack',
          id: json[0],
          cooldown: json[1],
        };
      } else {
        attackContent = json;
      }
      monsterAttackFeature.specialAttacks?.push({
        type: attackContent.type ?? 'monster_attack',
        id: attackContent.id,
        cooldown: attackContent.cooldown,
      });
    });
  }

  if (content.melee_cut) {
    monsterAttackFeature.meleeDamage.push({
      damageType: 'cut',
      amount: content.melee_cut,
      armorPenetration: 0,
      armorPenetrationMultiplier: 1,
      damageMultiplier: 1,
    });
  }

  if (content.starting_ammo) {
    const startingAmmoMap = new Map<string, number>(
      Object.entries(content.starting_ammo)
    );
    monsterAttackFeature.startingAmmo = reactive([]);
    startingAmmoMap.forEach((v, k) => {
      const temp = reactive({
        id: k,
        name: k,
        amount: v,
      });
      monsterAttackFeature.startingAmmo?.push(temp);
      void getBaseJsonItem('item', k).then((jsonItems) => {
        if (isNotEmpty(jsonItems)) {
          temp.name = getName(jsonItems);
        }
      });
    });
  }

  return monsterAttackFeature;
}
