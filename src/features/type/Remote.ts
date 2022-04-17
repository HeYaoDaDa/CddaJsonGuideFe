import { IdNameHelpInterface } from 'src/type';
import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { initIdNameHelpInterface, parseVolumeToMl } from 'src/utils/DataUtil';
import { getName, isItem } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';
import {
  DamageInstance,
  DamageInstanceJsonObject,
  initDamageInstanceByJsonObjects,
} from './other/Damage';
// islot_gun itype.h
export interface GunFeature {
  damage: DamageInstance[];
  range: number;
  dispersion: number;

  skillUse: IdNameHelpInterface;
  ammo: string[];
  durability: number;
  // For guns with an integral magazine what is the capacity?
  clip: number;
  // unit is move point
  reloadTime: number;
  reloadNoise: string;
  reloadNoiseVolume: number;
  // Maximum aim achievable using base weapon sights
  sightDispersion: number;
  loudness: number;
  upsCharges: number;
  // One in X chance for gun to require major cleanup after firing blackpowder shot.
  blackpowderTolerance: number;
  // Minimum ammo recoil for gun to be able to fire more than once per attack.
  minCycleRecoil: number;
  recoil: number;
  // Length of gun barrel, if positive allows sawing down of the barrel
  barrelVolume: number;
  ammoEffects: string[];
  validModLocations: [string, number][];
  builtInMods?: string[];
  defaultMods?: string[];
  // should have a flags
  modes: [string, string, number][];
  // How easy is control of recoil? If unset value automatically derived from weapon type
  handling: number;
  ammoToFire: number;
}
export function validate(jsonItem: JsonItem): boolean {
  return isItem(jsonItem.type);
}
export function initGunFeature(jsonItem: JsonItem): GunFeature {
  const gunFeature = reactive({} as GunFeature);
  const content = <GunJsonObject>jsonItem.content;

  gunFeature.skillUse = initIdNameHelpInterface(content.skill);
  void getBaseJsonItem('skill', gunFeature.skillUse.id).then((jsonItems) => {
    if (isNotEmpty(jsonItems)) {
      gunFeature.skillUse.name = getName(jsonItems);
    }
  });
  gunFeature.ammo = content.ammo;
  gunFeature.range = content.range ?? 0;
  gunFeature.damage = initDamageInstanceByJsonObjects(content.ranged_damage);
  gunFeature.dispersion = content.dispersion ?? 0;
  gunFeature.sightDispersion = content.sight_dispersion ?? 30;
  gunFeature.recoil = content.recoil ?? 0;
  gunFeature.handling = content.handling ?? -1; //TODO
  gunFeature.durability = content.durability ?? 0;
  gunFeature.loudness = content.loudness ?? 0;
  gunFeature.clip = content.clip_size ?? 0;
  gunFeature.reloadTime = content.reload ?? 100;
  gunFeature.reloadNoise = content.reload_noise ?? 'click.';
  gunFeature.reloadNoiseVolume = content.reload_noise_volume ?? 0;
  gunFeature.barrelVolume = parseVolumeToMl(content.barrel_volume ?? 0);
  gunFeature.builtInMods = content.built_in_mods;
  gunFeature.defaultMods = content.default_mods;
  gunFeature.upsCharges = content.ups_charges ?? 0;
  gunFeature.blackpowderTolerance = content.blackpowder_tolerance ?? 8;
  gunFeature.minCycleRecoil = content.min_cycle_recoil ?? 0;
  gunFeature.ammoEffects = content.ammo_effects ?? [];
  gunFeature.ammoToFire = content.ammo_to_fire ?? 1;

  gunFeature.validModLocations = content.valid_mod_locations ?? [];
  gunFeature.modes = content.modes ?? [];

  return gunFeature;
}

export interface GunJsonObject {
  skill: string;
  ammo: string[];
  range?: number;
  ranged_damage: DamageInstanceJsonObject | DamageInstanceJsonObject[];
  dispersion?: number;
  sight_dispersion?: number;
  recoil?: number;
  handling?: number;
  durability?: number;
  loudness?: number;
  clip_size?: number;
  reload?: number;
  reload_noise?: string;
  reload_noise_volume?: number;
  barrel_volume?: string | number;
  built_in_mods?: string[];
  default_mods?: string[];
  ups_charges?: number;
  blackpowder_tolerance?: number;
  min_cycle_recoil?: number;
  ammo_effects?: string[];
  ammo_to_fire?: number;
  valid_mod_locations?: [string, number][];
  modes?: [string, string, number][];
}
