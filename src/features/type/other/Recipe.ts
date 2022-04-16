import { i18n } from 'src/boot/i18n';
import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';
import { initRecipeCategoryFeature } from './recipeCategory';
import { initRequirementFeature, RequirementFeature } from './Requirement';

interface ContentBookLearn {
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
}

interface Byproduct {
  id: string;
  amount: number;
  name: string;
}
function initByproduct(value: [string, number]): Byproduct {
  const byproduct = reactive({} as Byproduct);
  byproduct.id = value[0];
  byproduct.amount = value[1];
  byproduct.name = byproduct.id;
  void getBaseJsonItem('item', byproduct.id).then(
    (jsonItems) =>
      (byproduct.name = isNotEmpty(jsonItems)
        ? getName(jsonItems[0])
        : byproduct.id)
  );
  return byproduct;
}

interface SkillUse {
  id: string;
  level: number;
  name: string;
}
function initSkillUse(value: [string, number]): SkillUse {
  const skillUse = reactive({} as SkillUse);
  skillUse.id = value[0];
  skillUse.level = value[1];
  skillUse.name = skillUse.id;
  void getBaseJsonItem('skill', skillUse.id).then(
    (jsonItem) => (skillUse.name = jsonItem ? getName(jsonItem) : skillUse.id)
  );
  return skillUse;
}

interface BookLearn {
  id: string;
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
  name: string;
}
function initBookLearn(
  content: ContentBookLearn,
  contentId: string
): BookLearn {
  const bookLearn = reactive({
    id: contentId,
    skill_level: content.skill_level,
    recipe_name: content.recipe_name,
    hidden: content.hidden,
    name: contentId,
  } as BookLearn);
  void getBaseJsonItem('item', bookLearn.id).then((jsonItems) => {
    if (isNotEmpty(jsonItems)) {
      bookLearn.name = getName(jsonItems[0]);
    }
  });
  return bookLearn;
}

interface BatchTime {
  multiplier: number;
  amount: number;
}
export interface RecipeContent {
  result?: string;
  byproducts?: [string, number][];
  category: string;
  subcategory: string;
  id_suffix?: string;
  override?: boolean;
  delete_flags?: string[];
  flags?: string[];
  skill_used: string;
  skills_required?: [string, number][] | [string, number];
  book_learn?: Map<string, ContentBookLearn> | [string, number][];
  difficulty?: number;
  time?: number | string;
  reversible?: boolean | { time: string | number };
  autolearn?: boolean | [string, number][];
  decomp_learn?: number | [string, number][];
  activity_level?: string;
  batch_time_factors: [number, number];
  obsolete?: boolean;
}

interface RecipeFeature {
  result?: string;
  obsolete: boolean;
  byproducts?: Byproduct[];
  category: string;
  categoryName: string;
  subcategory: string;
  subcategoryName: string;
  delete_flags?: string[];
  flags?: string[];
  skill_used: string;
  skillName?: string;
  skills: SkillUse[];
  bookLearn?: BookLearn[];
  difficulty?: number;
  time: string;
  reversible: string;
  autoLearn?: SkillUse[];
  decompLearn?: SkillUse[];
  activityLevel?: string;
  activityLevelName?: string;
  batchTime?: BatchTime;
  requirement: RequirementFeature;
}
export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'recipe';
}
export function initRecipeFeature(jsonItem: JsonItem): RecipeFeature {
  const recipeFeature = reactive({} as RecipeFeature);
  const content = <RecipeContent>jsonItem.content;
  recipeFeature.result = content.result;
  if (content.byproducts) {
    recipeFeature.byproducts = [];
    content.byproducts.forEach((byproduct) =>
      recipeFeature.byproducts?.push(initByproduct(byproduct))
    );
  }
  recipeFeature.obsolete = content.obsolete ?? false;
  recipeFeature.category = content.category;
  recipeFeature.subcategory = content.subcategory;
  recipeFeature.categoryName = recipeFeature.category;
  recipeFeature.subcategoryName = recipeFeature.subcategory;
  if (recipeFeature.category) {
    void getBaseJsonItem('recipe_category', recipeFeature.category).then(
      (jsonItems) => {
        if (isNotEmpty(jsonItems)) {
          recipeFeature.categoryName = getName(jsonItems);
          const recipeCategoryFeatrue = initRecipeCategoryFeature(jsonItems[0]);
          recipeFeature.subcategoryName =
            recipeCategoryFeatrue.recipeSubcategories.find(
              (subCategory) => subCategory.id == recipeFeature.subcategory
            )?.name ?? recipeFeature.subcategory;
        }
      }
    );
  }
  recipeFeature.delete_flags = content.delete_flags;
  recipeFeature.flags = content.flags;
  recipeFeature.skill_used = content.skill_used;
  recipeFeature.skillName = recipeFeature.skill_used;
  if (recipeFeature.skill_used) {
    void getBaseJsonItem('skill', recipeFeature.skill_used).then((jsonItem) =>
      jsonItem
        ? (recipeFeature.skillName = getName(jsonItem))
        : (recipeFeature.skillName = recipeFeature.skill_used)
    );
  }
  recipeFeature.skills = [];
  if (content.skills_required) {
    (typeof content.skills_required[0] === 'string'
      ? [content.skills_required]
      : content.skills_required
    ).forEach((skillRequire) =>
      recipeFeature.skills?.push(initSkillUse(skillRequire as [string, number]))
    );
  }
  if (content.book_learn) {
    recipeFeature.bookLearn = [];
    let bookLearnMap: Map<string, ContentBookLearn> = new Map();
    if (content.book_learn instanceof Array) {
      content.book_learn.forEach((bookLearn) =>
        bookLearnMap.set(bookLearn[0], { skill_level: bookLearn[1] })
      );
    } else {
      bookLearnMap = content.book_learn;
    }
    bookLearnMap.forEach((bookLearn, key) =>
      recipeFeature.bookLearn?.push(initBookLearn(bookLearn, key))
    );
  }
  recipeFeature.difficulty = content.difficulty;
  recipeFeature.time =
    (typeof content.time === 'string'
      ? content.time
      : content.time?.toString()) ?? '0';
  if (content.reversible) {
    if (typeof content.reversible === 'object') {
      recipeFeature.reversible =
        typeof content.reversible.time === 'string'
          ? content.reversible.time
          : content.reversible.time.toString();
    } else {
      recipeFeature.reversible = recipeFeature.time;
    }
  }
  if (content.autolearn) {
    if (typeof content.autolearn === 'boolean') {
      recipeFeature.autoLearn = [
        initSkillUse([recipeFeature.skill_used, recipeFeature.difficulty ?? 0]),
      ];
    } else {
      recipeFeature.autoLearn = [];
      content.autolearn.forEach((skill) =>
        recipeFeature.autoLearn?.push(initSkillUse(skill))
      );
    }
  }
  if (content.decomp_learn) {
    if (typeof content.decomp_learn === 'number') {
      recipeFeature.decompLearn = [
        initSkillUse([recipeFeature.skill_used, content.decomp_learn]),
      ];
    } else {
      recipeFeature.decompLearn = [];
      content.decomp_learn.forEach((skill) =>
        recipeFeature.decompLearn?.push(initSkillUse(skill))
      );
    }
  }
  recipeFeature.activityLevel = content.activity_level;
  if (recipeFeature.activityLevel) {
    recipeFeature.activityLevelName = i18n.global.t(
      'activityLevel.' + recipeFeature.activityLevel.split('_')[0].toLowerCase()
    );
  }
  if (content.batch_time_factors) {
    recipeFeature.batchTime = {
      multiplier: content.batch_time_factors[0],
      amount: content.batch_time_factors[1],
    };
  }
  recipeFeature.requirement = initRequirementFeature(jsonItem);
  return recipeFeature;
}
