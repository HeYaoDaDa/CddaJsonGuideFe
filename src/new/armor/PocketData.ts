import { isEmpty, isNotEmpty } from 'src/utils';
import { VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import {
  getArray,
  getBoolean,
  getLength,
  getNumber,
  getOptionalAsyncName,
  getOptionalVolume,
  getString,
  getVolume,
  getWeight,
} from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType, PocketType } from '../type';

export class PocketData extends SuperData<PocketDataInterface> {
  constructor(value: object) {
    super(value);
    this.parseJson(value);
  }
  getView(): VNode[] {
    return [];
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;
    data.pocketType = getString(
      jsonObject,
      'pocket_type',
      PocketType.CONTAINER
    );
    data.ammoRestriction = getArray(jsonObject, 'ammo_restriction', []).map(
      (value) => {
        const temp = value as [string, number];
        return [new AsyncName(temp[0], CddaType.ammo), temp[1]];
      }
    );
    data.flagRestrictions = getArray(jsonObject, 'flag_restriction', []).map(
      (flag) => {
        return new AsyncName(flag as string, CddaType.flag);
      }
    );
    data.itemIdRestriction = getArray(jsonObject, 'item_restriction', []).map(
      (value) => {
        return new AsyncName(value as string, CddaType.item);
      }
    );
    data.allowedSpeedloaders = getArray(
      jsonObject,
      'allowed_speedloaders',
      []
    ).map((value) => {
      return new AsyncName(value as string, CddaType.item);
    });
    data.defaultMagazine = getOptionalAsyncName(
      jsonObject,
      'default_magazine',
      CddaType.item
    );

    data.name = getString(jsonObject, 'name', '');
    data.description = getString(jsonObject, 'description', '');

    if (
      isNotEmpty(data.itemIdRestriction) &&
      isEmpty(data.defaultMagazine?.value.id)
    ) {
      data.defaultMagazine = data.itemIdRestriction[0];
    }

    if (isEmpty(data.ammoRestriction)) {
      data.minItemVolume = getVolume(jsonObject, 'min_item_volume', 0);
      data.maxItemVolume = getOptionalVolume(jsonObject, 'max_item_volume');
      data.volumeCapacity = getVolume(
        jsonObject,
        'max_contains_volume',
        200000 * 1000
      );
      data.weightCapacity = getWeight(
        jsonObject,
        'max_contains_weight',
        200000 * 1000 * 1000
      );
      data.maxItemLength = getLength(
        jsonObject,
        'max_item_length',
        Math.round(Math.cbrt(data.volumeCapacity))
      );
      data.minItemLength = getLength(jsonObject, 'min_item_length', 0);
      data.extraEncumbrance = getNumber(jsonObject, 'extra_encumbrance', 0);
      data.volumeEncumberModifier = getNumber(
        jsonObject,
        'volume_encumber_modifier',
        1
      );
      data.ripoff = getNumber(jsonObject, 'ripoff', 0);

      if (jsonObject.hasOwnProperty('activity_noise')) {
        data.activityNoise = generatePocketNoise(
          jsonObject.activity_noise as object
        );
      }

      data.spoilMultiplier = getNumber(jsonObject, 'spoil_multiplier', 1);
      data.weightMultiplier = getNumber(jsonObject, 'weight_multiplier', 1);
      data.volumeMultiplier = getNumber(jsonObject, 'volume_multiplier', 1);

      data.magazineWell = getNumber(jsonObject, 'magazine_well', 0);
      data.moves = getNumber(jsonObject, 'moves', 100);

      data.fireProtection = getBoolean(jsonObject, 'fire_protection', false);
      data.watertight = getBoolean(jsonObject, 'watertight', false);
      data.airtight = getBoolean(jsonObject, 'airtight', false);
      data.openContainer = getBoolean(jsonObject, 'open_container', false);
      data.rigid = getBoolean(jsonObject, 'rigid', false);
      data.holster = getBoolean(jsonObject, 'holster', false);
      data.ablative = getBoolean(jsonObject, 'ablative', false);
      if (data.ablative) {
        data.holster = true;
      }
      if (jsonObject.hasOwnProperty('sealed_data')) {
        data.sealedData = generateSealableData(
          jsonObject.sealed_data as object
        );
      }
    }
  }
}

interface PocketDataInterface {
  pocketType: string;
  description: string;
  name: string;

  volumeCapacity: number;
  weightCapacity: number;

  maxItemVolume?: number;
  minItemVolume: number;

  maxItemLength: number;
  minItemLength: number;

  holster: boolean;
  ablative: boolean;

  extraEncumbrance: number;
  volumeEncumberModifier: number;
  ripoff: number;
  activityNoise: PocketNoiseInterface;
  spoilMultiplier: number;
  weightMultiplier: number;
  volumeMultiplier: number;
  magazineWell: number;
  moves: number;
  fireProtection: boolean;
  watertight: boolean;
  airtight: boolean;
  openContainer: boolean;
  ammoRestriction: [AsyncName, number][];
  itemIdRestriction: AsyncName[];
  allowedSpeedloaders: AsyncName[];
  defaultMagazine?: AsyncName;
  rigid: boolean;
  flagRestrictions: AsyncName[];
  sealedData: SealableDataInterface;
}

interface PocketNoiseInterface {
  volume: number;
  chance: number;
}
function generatePocketNoise(value: object): PocketNoiseInterface {
  const jsonObject = value as Record<string, unknown>;
  const result = {} as PocketNoiseInterface;

  result.volume = getNumber(jsonObject, 'volume', 0);
  result.chance = getNumber(jsonObject, 'chance', 0);

  return result;
}

interface SealableDataInterface {
  spoilMultiplier: number;
}
function generateSealableData(value: object): SealableDataInterface {
  const jsonObject = value as Record<string, unknown>;
  const result = {} as SealableDataInterface;

  result.spoilMultiplier = getNumber(jsonObject, 'spoil_multiplier', 1);

  return result;
}
