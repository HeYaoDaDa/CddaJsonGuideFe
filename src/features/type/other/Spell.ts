import { i18n } from 'src/boot/i18n';
import { IdNameHelpInterface } from 'src/type';
import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import {
  hasFlag,
  initIdNameHelpInterface,
  initIdNameHelpInterfaces,
} from 'src/utils/DataUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'spell';
}

export function initSpellFeature(jsonItem: JsonItem): SpellFeature {
  const spellFeature = reactive({} as SpellFeature);
  const content = <SpellContent>jsonItem.content;

  spellFeature.class = initClass(content.spell_class);
  spellFeature.diffculty = content.difficulty;
  spellFeature.shape = initShape(content.shape);
  spellFeature.affectedBodyParts = initAffectedBodyParts(
    content.affected_body_parts
  );
  spellFeature.validTargets = initValidTargets(content.valid_targets);
  spellFeature.flags = content.flags;
  spellFeature.maxLevel = content.max_level;

  spellFeature.damageType = initDamageType(content.damage_type);
  spellFeature.minDamage = content.min_damage;
  spellFeature.maxDamage = content.max_damage;
  spellFeature.damageIncrement = content.damage_increment;

  spellFeature.minAoe = content.min_aoe;
  spellFeature.maxAoe = content.max_aoe;
  spellFeature.aoeIncrement = content.aoe_increment;

  spellFeature.minRange = content.min_range;
  spellFeature.maxRange = content.max_range;
  spellFeature.rangeIncrement = content.range_increment;

  spellFeature.baseCastingTime = content.base_casting_time;
  spellFeature.baseEnergyCost = content.base_energy_cost;
  spellFeature.energySource = initEnergySource(content.energy_source);

  spellFeature.effect = content.effect;

  spellFeature.require = initRequire(content.flags, spellFeature);
  return spellFeature;
}

interface SpellContent {
  effect: string;
  effect_str: string;
  shape: string;
  affected_body_parts: string[];
  valid_targets: string[];
  flags: string[];
  max_level: number;
  min_damage: number;
  max_damage: number;
  damage_increment: number;
  min_aoe: number;
  max_aoe: number;
  aoe_increment: number;
  min_range: number;
  max_range: number;
  range_increment: number;
  spell_class: string;
  base_casting_time: number;
  base_energy_cost: number;
  energy_source: string;
  difficulty: number;
  damage_type: string;
}

interface SpellFeature {
  class: IdNameHelpInterface;
  diffculty: number;
  shape: IdNameHelpInterface;
  flags?: string[];
  require: string[];
  affectedBodyParts: IdNameHelpInterface[];
  validTargets: IdNameHelpInterface[];
  maxLevel: number;

  baseCastingTime: number;

  baseEnergyCost: number;
  energySource: IdNameHelpInterface;

  damageType: IdNameHelpInterface;
  minDamage: number;
  maxDamage: number;
  damageIncrement: number;

  minRange: number;
  maxRange: number;
  rangeIncrement: number;

  minAoe: number;
  maxAoe: number;
  aoeIncrement: number;

  effect: string;
}
function initClass(val: string): IdNameHelpInterface {
  const result = initIdNameHelpInterface(val);
  if (result.id.toLocaleLowerCase() === 'none') {
    result.name = i18n.global.t('label.none');
  } else {
    void getBaseJsonItem('mutation', result.id).then((jsonItems) => {
      if (isNotEmpty(jsonItems)) {
        result.name = getName(jsonItems);
      }
    });
  }
  return result;
}

function initShape(val: string): IdNameHelpInterface {
  const result = initIdNameHelpInterface(val);
  //TODO transfer name
  return result;
}

function initAffectedBodyParts(vals: string[]): IdNameHelpInterface[] {
  const result = initIdNameHelpInterfaces(vals);
  result.forEach((bodyPart) => {
    void getBaseJsonItem('body_part', bodyPart.id).then((jsonItems) => {
      if (isNotEmpty(jsonItems)) {
        bodyPart.name = getName(jsonItems);
      }
    });
  });
  return result;
}

function initValidTargets(vals: string[]): IdNameHelpInterface[] {
  const result = initIdNameHelpInterfaces(vals);
  //TODO transfer name
  return result;
}

function initRequire(vals: string[], spell: SpellFeature): string[] {
  const result = [] as string[];
  if (hasFlag(vals, 'concentrate')) {
    result.push('requires_concentration');
  }
  if (hasFlag(vals, 'verbal')) {
    result.push('verbal');
  }
  if (hasFlag(vals, 'somatic')) {
    result.push('somatic');
  }
  if (hasFlag(vals, 'no_hands')) {
    result.push('impeded_by_gloves');
  } else {
    result.push('does_not_require_hands');
  }
  if (hasFlag(vals, 'no_legs')) {
    result.push('requires_mobility');
  }
  if (
    spell.effect === 'attack' &&
    spell.maxRange > 1 &&
    hasFlag(vals, 'no_projectile')
  ) {
    result.push('can_be_cast_through_walls');
  }
  result.forEach((v, k) => (result[k] = i18n.global.t('spellFlags.' + v)));
  return result;
}

function initDamageType(val: string): IdNameHelpInterface {
  const result = initIdNameHelpInterface(val);
  //TODO transfer name
  return result;
}

function initEnergySource(val: string): IdNameHelpInterface {
  const result = initIdNameHelpInterface(val);
  //TODO transfer name
  return result;
}
