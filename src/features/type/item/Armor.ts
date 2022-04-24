import { IdNameHelpInterface } from 'src/type';
import { isNotEmpty } from 'src/utils';
import { getNotEmptyJsonItems } from 'src/utils/baseJsonItemMapUtil';
import {
  convertToArray,
  initIdNameHelpInterface,
  initIdNameHelpInterfaces,
  parseWeightToG,
} from 'src/utils/DataUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

export interface MaterialPartContent {
  type: string;
  covered_by_mat?: number;
  thickness?: number;
  ignore_sheet_thickness?: boolean;
}

// part_material itype.h
export interface MaterialPartData {
  id: string;
  name: string;
  cover: number;
  thickness: number;
  ignoreSheetThickness: boolean;
}
function initMaterialPartDataByNew(
  content: MaterialPartContent
): MaterialPartData {
  const result = reactive({}) as MaterialPartData;

  result.id = content.type;
  result.name = content.type;
  void getNotEmptyJsonItems('material', result.id).then((jsonItems) =>
    getName(jsonItems)
  );
  result.cover = content.covered_by_mat ?? 100;
  result.thickness = content.thickness ?? 0;
  result.ignoreSheetThickness = content.ignore_sheet_thickness ?? false;

  return result;
}
function initMaterialPartDataByOld(content: string): MaterialPartData {
  return initMaterialPartDataByNew({ type: content });
}
function initMaterialPartData(content: MaterialPartContent | string) {
  if (typeof content === 'string') {
    return initMaterialPartDataByOld(content);
  } else {
    return initMaterialPartDataByNew(content);
  }
}
export function initMaterialPartDatas(
  contents: (MaterialPartContent | string) | (MaterialPartContent | string)[]
) {
  return reactive(
    convertToArray(contents).map((content) => initMaterialPartData(content))
  );
}

// armor_portion_data itype.h
export interface ArmorPartData {
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

  materials: MaterialPartData[];

  covers?: IdNameHelpInterface[];
  subCovers: IdNameHelpInterface[];
  layers: string[];

  rigidLayerOnly: boolean;
}

export function initArmorPartData(val: unknown): ArmorPartData {
  const content = val as ArmorPartContent;
  const result = reactive({}) as ArmorPartData;

  if (content.encumbrance) {
    if (content.encumbrance instanceof Array) {
      result.encumber = content.encumbrance[0];
      result.maxEncumber = content.encumbrance[1];
    } else {
      result.encumber = content.encumbrance;
    }
  } else {
    result.encumber = 0;
  }
  result.volumeEncumberModifier = content.volume_encumber_modifier ?? 1;

  result.coverage = content.coverage ?? 0;
  result.coverMelee = content.cover_melee ?? 0;
  result.coverRanged = content.cover_ranged ?? 0;
  result.coverVitals = content.cover_vitals ?? 0;

  result.avgThickness = content.material_thickness ?? 0;

  result.envResist = content.environmental_protection ?? 0;
  result.envResistFilter = content.environmental_protection_with_filter ?? 0;

  if (content.material) {
    result.materials = initMaterialPartDatas(content.material);
  } else {
    content.material = [];
  }

  if (content.covers) {
    result.covers = initIdNameHelpInterfaces(convertToArray(content.covers));
    result.covers.forEach((cover) => {
      void getNotEmptyJsonItems('body_part', cover.id).then(
        (jsonItems) => (cover.name = getName(jsonItems))
      );
    });
  }

  const specifically_covers: string[] = reactive([]);
  if (content.specifically_covers) {
    specifically_covers.push(...convertToArray(content.specifically_covers));
  } else if (isNotEmpty(result.covers) && result.covers) {
    // all sub body
    result.covers.forEach((cover) => {
      void getNotEmptyJsonItems('body_part', cover.id).then((jsonItems) =>
        specifically_covers.push(
          ...(<{ sub_parts: string[] }>jsonItems[0].content).sub_parts
        )
      );
    });
  }
  if (isNotEmpty(specifically_covers)) {
    result.subCovers = initIdNameHelpInterfaces(specifically_covers);
    result.subCovers.forEach((cover) => {
      void getNotEmptyJsonItems('sub_body_part', cover.id).then(
        (jsonItems) => (cover.name = getName(jsonItems))
      );
    });
  }
  result.layers = content.layers ?? ['normal'];

  result.rigidLayerOnly = content.rigid_layer_only ?? false;

  return result;
}
export interface ArmorPartContent {
  encumbrance?: number | number[];
  volume_encumber_modifier?: number;

  coverage?: number;
  cover_melee?: number;
  cover_ranged?: number;
  cover_vitals?: number;

  material_thickness?: number;

  environmental_protection?: number;
  environmental_protection_with_filter?: number;

  material?: (MaterialPartContent | string) | (MaterialPartContent | string)[];

  covers?: string | string[];
  specifically_covers?: string | string[];
  layers?: string[];

  rigid_layer_only?: boolean;
}

export interface ArmorContent {
  armor?: ArmorPartContent | ArmorPartContent[];
  covers?: string | string[];
  material_thickness?: number;
  environmental_protection?: number;
  environmental_protection_with_filter?: number;
  sided?: boolean;
  warmth?: number;
  non_functional?: string;
  weight_capacity_modifier?: number;
  weight_capacity_bonus?: number | string;
  power_armor?: boolean;
  valid_mods?: string | string[];
}

// islot_armor itype.h
export interface ArmorFeature {
  covers: IdNameHelpInterface[];
  sided: boolean;
  nonFunctional?: IdNameHelpInterface;
  warmth: number;
  weightCapacityModifier: number;
  weightCapacityBonus: number;
  powerArmor: boolean;
  armorData: ArmorPartData[];
  subArmorData: ArmorPartData[];
  rigid: boolean;
  comfortable: boolean;
  validMods: IdNameHelpInterface[];
  materialThickness?: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
}

export function initArmorFeature(jsonItem: JsonItem): ArmorFeature {
  const content = jsonItem.content as ArmorContent;
  const result = reactive({}) as ArmorFeature;

  result.subArmorData = reactive([]);
  if (content.armor) {
    convertToArray(content.armor).forEach((armorContent) =>
      result.subArmorData.push(initArmorPartData(armorContent))
    );
  }

  result.covers = initIdNameHelpInterfaces(
    convertToArray(content.covers ?? [])
  );
  result.covers.forEach(
    (cover) =>
      void getNotEmptyJsonItems('body_part', cover.id).then(
        (jsonItems) => (cover.name = getName(jsonItems))
      )
  );

  result.materialThickness = content.material_thickness;
  result.environmentalProtection = content.environmental_protection;
  result.environmentalProtectionFilter =
    content.environmental_protection_with_filter;

  result.subArmorData.forEach((subArmorData) => {
    if (result.materialThickness)
      subArmorData.avgThickness = result.materialThickness;
    if (result.environmentalProtection)
      subArmorData.envResist = result.environmentalProtection;
    if (result.environmentalProtectionFilter)
      subArmorData.envResistFilter = result.environmentalProtectionFilter;
    if (isNotEmpty(result.covers)) {
      subArmorData.covers = result.covers;
    }
  });

  result.sided = content.sided ?? false;
  result.warmth = content.warmth ?? 0;

  if (content.non_functional) {
    result.nonFunctional = initIdNameHelpInterface(content.non_functional);
    void getNotEmptyJsonItems('item', result.nonFunctional.id).then(
      (jsonItems) => {
        if (result.nonFunctional)
          result.nonFunctional.name = getName(jsonItems);
      }
    );
  }

  result.weightCapacityModifier = content.weight_capacity_modifier ?? 1;
  result.weightCapacityBonus = parseWeightToG(
    content.weight_capacity_bonus ?? 0
  );
  result.powerArmor = content.power_armor ?? false;

  result.validMods = initIdNameHelpInterfaces(
    convertToArray(content.valid_mods ?? [])
  );
  result.validMods.forEach(
    (mod) =>
      void getNotEmptyJsonItems('item', mod.id).then(
        (jsonItems) => (mod.name = getName(jsonItems))
      )
  );
  return result;
}

interface ArmorUseBaseInfo {
  materials: string[];
  materialPortionTotal: number;
  pockets: unknown[];
  flags: string[];
}

interface PocketData {
  pocketType?: string;
  volumeCapacity?: number;
  maxItemVolume?: number;
  minItemVolume?: number;
  minItemLength?: number;
  maxContainsWeight?: number;
  maxItemLength?: number;
  holster?: boolean;
  ablative?: boolean;
  extraEncumbrance?: number;
  volumeEncumberModifier?: number;
  ripoff?: number;
  activityNoise?: number;
  spoilMultiplier?: number;
  weightMultiplier?: number;
  volumeMultiplier?: number;
  moves?: number;
  fireProtection?: boolean;
  watertight?: boolean;
  airtight?: boolean;
  openContainer?: boolean;
  ammoRestriction?: [string, number][];
  itemIdRestriction?: string[];
  allowedSpeedloaders?: string[];
  defaultMagazine?: string;
  rigid?: boolean;
  flagRestrictions?: string[];
}
interface PocketDataContent {
  pocket_type?: string;
  volumeCapacity?: number;
  maxItemVolume?: number;
  minItemVolume?: number;
  minItemLength?: number;
  maxContainsWeight?: number;
  maxItemLength?: number;
  holster?: boolean;
  ablative?: boolean;
  extraEncumbrance?: number;
  volumeEncumberModifier?: number;
  ripoff?: number;
  activityNoise?: number;
  spoilMultiplier?: number;
  weightMultiplier?: number;
  volumeMultiplier?: number;
  moves?: number;
  fireProtection?: boolean;
  watertight?: boolean;
  airtight?: boolean;
  openContainer?: boolean;
  ammoRestriction?: [string, number][];
  itemIdRestriction?: string[];
  allowedSpeedloaders?: string[];
  defaultMagazine?: string;
  rigid?: boolean;
  flagRestrictions?: string[];
}

export function initPocketData(jsonItem: JsonItem): PocketData {
  const content = jsonItem.content as PocketDataContent;
  const result = reactive({}) as PocketData;

  result.pocketType = content.pocket_type;

  return result;
}

// function loadArmor(armor: ArmorFeature) {
//   armor.subArmorData.forEach(subArmorData=>{

//   })
// }
