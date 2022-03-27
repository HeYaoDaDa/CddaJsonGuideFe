interface ReproductionContent {
  baby_flags?: string[] | string;
  reproduction?: {
    baby_monster: string;
    baby_egg: string;
    baby_count: number;
    baby_timer: number;
  };
}

export class ReproductionFeature {
  baby_flags: string[];
  reproduction?: {
    baby_monster: string;
    baby_monster_name?: string;
    baby_egg: string;
    baby_egg_name?: string;
    baby_count: number;
    baby_timer: number;
  };
  constructor(jsonItem: JsonItem) {
    const reproductionContent = jsonItem.content as ReproductionContent;
    this.baby_flags =
      (typeof reproductionContent.baby_flags === 'string'
        ? [reproductionContent.baby_flags]
        : reproductionContent.baby_flags) ?? [];
    this.reproduction = reproductionContent.reproduction;
  }
}
