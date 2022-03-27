import { getModName, getName } from 'src/utils/JsonItemUtil';

interface ReproductionContent {
  baby_flags?: string[];
  reproduction?: {
    baby_monster: string;
    baby_egg: string;
    baby_count: number;
    baby_timer: number;
  };
}

export class ReproductionFeature {
  name: string;
  mod: string;
  baby_flags?: string[];
  reproduction?: {
    baby_monster: string;
    baby_egg: string;
    baby_count: number;
    baby_timer: number;
  };
  constructor(jsonItem: JsonItem) {
    const reproductionContent = jsonItem.content as ReproductionContent;
    this.name = getName(jsonItem);
    this.mod = getModName(jsonItem.mod);
    this.baby_flags = reproductionContent.baby_flags;
    this.reproduction = reproductionContent.reproduction;
  }
}
