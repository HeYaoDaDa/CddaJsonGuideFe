import { i18n } from 'src/boot/i18n';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';
import { initRecipeCategoryFeature } from './recipeCategory';

interface ContentBookLearn {
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
}

interface ContentProficiency {
  proficiency: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
}

interface ContentQualitie {
  id: string;
  level?: number;
  amount?: number;
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
    (jsonItem) => (byproduct.name = jsonItem ? getName(jsonItem) : byproduct.id)
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
  void getBaseJsonItem('item', bookLearn.id).then((jsonItem) => {
    if (jsonItem) {
      bookLearn.name = getName(jsonItem);
    }
  });
  return bookLearn;
}

interface Proficiency {
  proficiency: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
  name: string;
}
function initProficiency(content: ContentProficiency): Proficiency {
  const proficiency = reactive({} as Proficiency);
  proficiency.proficiency = content.proficiency;
  proficiency.required = content.required;
  proficiency.time_multiplier = content.time_multiplier;
  proficiency.fail_multiplier = content.fail_multiplier;
  proficiency.learning_time_multiplier = content.learning_time_multiplier;
  proficiency.max_experience = content.max_experience;
  proficiency.name = proficiency.proficiency;
  void getBaseJsonItem('proficiency', proficiency.proficiency).then(
    (jsonItem) => {
      if (jsonItem) {
        proficiency.name = getName(jsonItem);
        const proficiencyContent = jsonItem.content as {
          default_time_multiplier: number;
          default_fail_multiplier: number;
        };
        proficiency.time_multiplier =
          proficiency.time_multiplier ??
          proficiencyContent.default_time_multiplier;
        proficiency.fail_multiplier =
          proficiency.fail_multiplier ??
          proficiencyContent.default_fail_multiplier;
      }
    }
  );
  return proficiency;
}

interface BatchTime {
  multiplier: number;
  amount: number;
}

interface Qualitie {
  id: string;
  level: number;
  amount: number;
  name: string;
}
function initQualitie(content: ContentQualitie): Qualitie {
  const qualitie = reactive({} as Qualitie);
  qualitie.id = content.id;
  qualitie.level = content.level ?? 0;
  qualitie.amount = content.amount ?? 1;
  qualitie.name = qualitie.id;
  void getBaseJsonItem('tool_quality', qualitie.id).then((jsonItem) => {
    jsonItem
      ? (qualitie.name = getName(jsonItem))
      : (qualitie.name = qualitie.id);
  });
  return qualitie;
}

interface Tool {
  id: string;
  amount: number;
  other?: string;
  name: string;
}
function initTool(value: [string, number, string | undefined]): Tool {
  const tool = reactive({} as Tool);
  tool.id = value[0];
  tool.amount = value[1] ?? -1;
  tool.other = value[2];
  tool.name = tool.id;
  void getBaseJsonItem('item', tool.id).then(
    (jsonItem) => (tool.name = jsonItem ? getName(jsonItem) : tool.id)
  );
  return tool;
}

interface Component {
  id: string;
  amount: number;
  other?: string;
  name: string;
}
function initComponent(value: [string, number, string | undefined]): Component {
  const component = reactive({} as Component);
  component.id = value[0];
  component.amount = value[1];
  component.other = value[2];
  component.name = component.id;
  void getBaseJsonItem('item', component.id).then(
    (jsonItem) => (component.name = jsonItem ? getName(jsonItem) : component.id)
  );
  return component;
}
interface Use {
  id: string;
  amount: number;
  name?: string;
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
  proficiencies?: ContentProficiency[];
  batch_time_factors: [number, number];
  qualities?: ContentQualitie[];
  tools?: [string, number, string | undefined][][];
  using?: [string, number][];
  components?: [string, number, string | undefined][][];
  obsolete?: boolean;
}

interface RecipeFeature {
  result?: string;
  resultName?: string;
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
  proficiencies?: Proficiency[];
  batchTime?: BatchTime;
  qualities?: Qualitie[];
  tools?: Tool[][];
  using?: Use[];
  components?: Component[][];
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
      (jsonItem) => {
        if (jsonItem) {
          recipeFeature.categoryName = getName(jsonItem);
          const recipeCategoryFeatrue = initRecipeCategoryFeature(jsonItem);
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
  } else {
    recipeFeature.reversible = '0';
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
  if (content.proficiencies) {
    recipeFeature.proficiencies = [];
    content.proficiencies.forEach((proficiencie) =>
      recipeFeature.proficiencies?.push(initProficiency(proficiencie))
    );
  }
  if (content.batch_time_factors) {
    recipeFeature.batchTime = {
      multiplier: content.batch_time_factors[0],
      amount: content.batch_time_factors[1],
    };
  }
  if (content.qualities) {
    recipeFeature.qualities = content.qualities.map((qualitie) =>
      initQualitie(qualitie)
    );
  }
  if (content.tools) {
    recipeFeature.tools = [];
    content.tools.forEach((tools, index) => {
      tools.forEach((tool) => {
        if (tool[2] !== 'LIST') {
          if (recipeFeature.tools && !recipeFeature.tools[index]) {
            recipeFeature.tools[index] = [];
          }
          recipeFeature.tools?.[index].push(initTool(tool));
        } else {
          if (!recipeFeature.using) {
            recipeFeature.using = [];
          }
          recipeFeature.using?.push({ id: tool[0], amount: tool[1] });
        }
      });
    });
  }
  if (content.using) {
    if (!recipeFeature.using) {
      recipeFeature.using = [];
    }
    content.using.forEach((using) => {
      recipeFeature.using?.push({ id: using[0], amount: using[1] });
    });
  }
  if (content.components) {
    recipeFeature.components = [];
    content.components.forEach((components, index) => {
      components.forEach((component) => {
        if (component[2] !== 'LIST') {
          if (recipeFeature.components && !recipeFeature.components[index]) {
            recipeFeature.components[index] = [];
          }
          recipeFeature.components?.[index].push(initComponent(component));
        } else {
          if (!recipeFeature.using) {
            recipeFeature.using = [];
          }
          recipeFeature.using?.push({ id: component[0], amount: component[1] });
        }
      });
    });
  }
  processUsing(recipeFeature.using, recipeFeature);
  return recipeFeature;
}
function processUsing(
  using: Use[] | undefined,
  recipe: RecipeFeature,
  amount?: number
) {
  if (using) {
    using.forEach((using) => {
      void getBaseJsonItem('requirement', using.id).then((jsonItem) => {
        if (jsonItem) {
          const requirement = reactive(initRecipeFeature(jsonItem));
          if (requirement.proficiencies) {
            if (!recipe.proficiencies) {
              recipe.proficiencies = [];
            }
            recipe.proficiencies.push(...requirement.proficiencies);
          }

          if (requirement.tools) {
            requirement.tools.forEach((tools) =>
              tools.forEach(
                (tool) => (tool.amount *= using.amount * (amount ?? 1))
              )
            );
            if (!recipe.tools) {
              recipe.tools = [];
            }
            recipe.tools.push(...requirement.tools);
          }

          if (requirement.qualities) {
            requirement.qualities.forEach(
              (qualitie) => (qualitie.amount *= using.amount * (amount ?? 1))
            );
            if (!recipe.qualities) {
              recipe.qualities = reactive([]);
            }
            recipe.qualities?.push(...reactive(requirement.qualities));
          }

          if (requirement.components) {
            requirement.components.forEach((components) =>
              components.forEach(
                (component) =>
                  (component.amount *= using.amount * (amount ?? 1))
              )
            );
            if (!recipe.components) {
              recipe.components = [];
            }
            recipe.components.push(...requirement.components);
          }

          if (requirement.using) {
            processUsing(requirement.using, recipe, using.amount);
          }
        }
      });
    });
  }
}
