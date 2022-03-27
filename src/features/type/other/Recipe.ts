interface BookLearn {
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
}

interface proficiency {
  proficiency?: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
}

interface qualitie {
  id?: string;
  level?: number;
  amount?: number;
}

export interface RecipeContent {
  result?: string;
  byproducts?: string[][];
  category?: string;
  subcategory?: string;
  id_suffix?: string;
  override?: boolean;
  delete_flags?: string[];
  skill_used?: string;
  skills_required?: [string, number][];
  book_learn?: Map<string, BookLearn>;
  difficulty?: number;
  time?: number | string;
  reversible?: boolean | { time: string | number };
  autolearn?: boolean | [string, number][];
  decomp_learn?: number | [string, number][];
  activity_level?: string;
  proficiencies?: proficiency[];
  batch_time_factors: [number, number];
  qualities?: qualitie[];
  tools?: [string, number][][];
  using?: [string, number][];
  components?: [string, number][][];
}

export class RecipeFeature {
  result?: string;
  constructor(jsonItem: JsonItem) {
    // TODO
    const recipeContent = <RecipeContent>jsonItem.content;
    this.result = recipeContent.result;
  }
}
