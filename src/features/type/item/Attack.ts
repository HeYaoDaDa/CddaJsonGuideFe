import { parseVolumeToMl, parseWeightToG } from 'src/utils/DataUtil';

interface ToHitInterface {
  grip: string;
  length: string;
  surface: string;
  balance: string;
}

interface AttackContent {
  weapon_category?: string | string[];
  bashing?: number;
  cutting?: number;
  piercing?: number;
  to_hit?: number | ToHitInterface;
  volume?: string | number;
  weight?: string | number;
}

export class AttackFeature {
  weapon_category?: string[];
  bashing: number;
  cutting: number;
  piercing: number;
  to_hit: number | string;
  baseMovesPerAttack: number;

  constructor(jsonItem: JsonItem) {
    const attackContent = jsonItem.content as AttackContent;
    this.weapon_category =
      typeof attackContent.weapon_category === 'string'
        ? [attackContent.weapon_category]
        : attackContent.weapon_category;
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

    this.baseMovesPerAttack =
      65 +
      Math.floor(parseVolumeToMl(attackContent.volume ?? 0) / 62.5) +
      Math.floor(parseWeightToG(attackContent.weight ?? 0) / 60);
  }
}
