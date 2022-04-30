/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddictionId,
  AmmoId,
  BodyPartId,
  DiseasetypeId,
  ItemId,
  MaterialId,
  MonsterGroupId,
  SkillId,
  SubBodyPartId,
} from './id';
import { Nutrients } from './stomach';
import { Translation } from 'src/new/translation';

interface GunMode {
  name: Translation;
  amount: number;
  flags: string[];
}

interface GunModLocation {
  id: string;
  name: Translation;
}

interface Tool {
  ammo: AmmoId;
  revertTo?: ItemId;
  subType: ItemId;

  maxCharges: number;
  defaultCharges: number;
  chargeFactor: number;
  usePerCharges: number;
  turnsPerCharges: number;
  powerDraw: number;
  RandmonCharges: number[];
}

interface Comestible {
  comestibleType: string;
  tool: ItemId;
  defaultCharges: number;
  quench: number;
  defaultNutrition: Nutrients;
  spoils: number;

  addictionPotential: number;
  addiction: AddictionId;
  stimulant: number;
  fatigue: number;

  cookLike: ItemId;
  smokingResult: ItemId;

  healthy: number;
  parasites: number;
  radiation: number;
  freezePoint: number;
  petfood: Translation[];
  contamination: Map<DiseasetypeId, number>;

  specificHeatLiquid: number;
  specificHeatSolid: number;
  latentHeat: number;

  monotonyPenalty: number;
  rotSpawn: MonsterGroupId;
  rotSpawnChance: number;

  fun: number;
}

interface Brewable {
  results: Map<ItemId, string>;
  time: number;
}

interface ArmorMaterial {
  id: MaterialId;
  name: string;
  cover: number;
  thickness: number;
  ignoreSheetThickness: boolean;
}

export interface ArmorBodyPartData {
  encumber: number;
  maxEncumber?: number;
  volumeEncumberModifier: number;

  coverage: number;
  coverMelee: number;
  coverRanged: number;
  coverVitals: number;

  avgThickness: number;

  envResist: number;
  envResistFilter: number;

  materials: ArmorMaterial[];

  covers: Map<BodyPartId, string>;
  subCovers: Map<SubBodyPartId, string>;
  layers: Translation[];

  rigidLayerOnly: boolean;

  breathability: number;
  rigid: boolean;
  comfortable: boolean;
}

interface Armor {
  covers: Map<BodyPartId, string>;
  sided: boolean;
  nonFunctional?: [ItemId, string];
  warmth: number;
  weightCapacityModifier: number;
  weightCapacityBonus: number;
  powerArmor: boolean;
  armorData: ArmorBodyPartData[];
  subArmorData: ArmorBodyPartData[];
  rigid: boolean;
  comfortable: boolean;
  validMods: [ItemId, string][];
  materialThickness?: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
  allLayers: Translation;
}

interface PetArmor {
  thickness: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
  minVolume: number;
  maxVolume: number;
  bodyType: string;
  powerArmor: boolean;
}

interface Book {
  skill: SkillId;
  martialArt: MaterialId;
  level: number;
  required: number;
  fun: number;
  Intelligence: number;
  time: number;
  chapters: number;
}
