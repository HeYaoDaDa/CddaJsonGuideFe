import { parseVolumeToMl, parseWeightToG } from 'src/utils/DataUtil';
import { getModName, getName } from 'src/utils/JsonItemUtil';

interface ToHitInterface {
  grip: string;
  length: string;
  surface: string;
  balance: string;
}

export interface AttackContent {
  weapon_category?: string | string[];
  bashing?: number;
  cutting?: number;
  piercing?: number;
  to_hit?: number | ToHitInterface;
  volume?: string | number;
  weight?: string | number;
}

export class AttackFeature {
  name: string;
  mod: string;
  weapon_category?: string[];
  bashing: number;
  cutting: number;
  piercing: number;
  to_hit: number | string;
  baseMovesPerAttack: number;

  constructor(jsonItem: JsonItem) {
    const attackContent = jsonItem.content as AttackContent;
    this.name = getName(jsonItem);
    this.mod = getModName(jsonItem.mod);

    this.bashing = attackContent.bashing ?? 0;
    this.cutting = attackContent.cutting ?? 0;
    this.piercing = attackContent.piercing ?? 0;

    if (typeof attackContent.to_hit === 'number') {
      this.to_hit = attackContent.to_hit;
    } else if (typeof attackContent.to_hit === 'object') {
      //TODO
      this.to_hit = 0;
    } else {
      this.to_hit = 0;
    }

    if (attackContent.volume && attackContent.weight) {
      this.baseMovesPerAttack =
        65 +
        Math.floor(parseVolumeToMl(attackContent.volume) / 62.5) +
        Math.floor(parseWeightToG(attackContent.weight) / 60);
    } else {
      this.baseMovesPerAttack = 65;
    }
  }
}
