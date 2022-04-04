import { Field, FieldStyle } from 'src/type/FieldType';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

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

class Byproduct {
  id: string;
  amount: number;
  name?: string;
  constructor(value: [string, number]) {
    this.id = value[0];
    this.amount = value[1];
  }
  toField(): Field {
    return {
      content: [
        {
          content: () => {
            if (this.name) {
              return this.name;
            } else {
              void getBaseJsonItem('item', this.id).then(
                (jsonItem) =>
                  (this.name = jsonItem ? getName(jsonItem) : this.id)
              );
              return this.name ?? this.id;
            }
          },
          contentRoute: {
            name: 'jsonItem',
            params: { jsonType: 'item', jsonId: this.id },
          },
        },
        {
          content: ` x ${this.amount}`,
        },
      ],
      style: FieldStyle.STRING,
    };
  }
}

class SkillUse {
  id: string;
  level: number;
  name?: string;
  constructor(value: [string, number]) {
    this.id = value[0];
    this.level = value[1];
  }
  toField(): Field {
    return {
      content: [
        {
          content: () => {
            if (this.name) {
              return this.name;
            } else {
              void getBaseJsonItem('skill', this.id).then(
                (jsonItem) =>
                  (this.name = jsonItem ? getName(jsonItem) : this.id)
              );
              return this.name ?? this.id;
            }
          },
          contentRoute: {
            name: 'jsonItem',
            params: { jsonType: 'item', jsonId: this.id },
          },
        },
        {
          content: ` (${this.level})`,
        },
      ],
      style: FieldStyle.STRING,
    };
  }
}

interface BookLearn {
  id: string;
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
  name?: string;
}

class Proficiency {
  proficiency: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
  name?: string;
  constructor(content: ContentProficiency) {
    this.proficiency = content.proficiency;
    this.required = content.required;
    this.time_multiplier = content.time_multiplier;
    this.fail_multiplier = content.fail_multiplier;
    this.learning_time_multiplier = content.learning_time_multiplier;
    this.max_experience = content.max_experience;
  }
  toField(): Field {
    return {
      content: [
        {
          content: () => {
            if (this.name) {
              return this.name;
            } else {
              void getBaseJsonItem('proficiency', this.proficiency).then(
                (jsonItem) => {
                  if (jsonItem) {
                    this.name = getName(jsonItem);
                    const proficiencyContent = jsonItem.content as {
                      default_time_multiplier: number;
                      default_fail_multiplier: number;
                    };
                    this.time_multiplier =
                      this.time_multiplier ??
                      proficiencyContent.default_time_multiplier;
                    this.fail_multiplier =
                      this.fail_multiplier ??
                      proficiencyContent.default_fail_multiplier;
                  } else {
                    this.name = this.proficiency;
                  }
                }
              );
              return this.name ?? this.proficiency;
            }
          },
        },
        {
          content: ` (${this.time_multiplier ?? 1}x time, ${
            this.fail_multiplier ?? 1
          }x fail)`,
        },
      ],
      style: FieldStyle.STRING,
    };
  }
}

interface BatchTime {
  multiplier: number;
  amount: number;
}

class Qualitie {
  id: string;
  level: number;
  amount: number;
  name?: string;

  constructor(content: ContentQualitie) {
    this.id = content.id;
    this.level = content.level ?? 0;
    this.amount = content.amount ?? 1;
  }

  toField(): Field {
    return {
      content: [
        {
          content: () => {
            if (this.name) {
              return this.name;
            } else {
              void getBaseJsonItem('tool_quality', this.id).then((jsonItem) =>
                jsonItem
                  ? (this.name = getName(jsonItem))
                  : (this.name = this.id)
              );
              return this.name ?? this.id;
            }
          },
          contentRoute: {
            name: 'feature',
            params: { feature: 'qualities', sub: this.id },
          },
        },
        {
          content: ` (${this.level}) x ${this.amount ?? 1}`,
        },
      ],
      style: FieldStyle.STRING,
    };
  }
}

interface Tool {
  id: string;
  amount: number;
  name?: string;
}
class Component {
  id: string;
  amount: number;
  other?: string;
  name?: string;
  constructor(value: [string, number, string | undefined]) {
    this.id = value[0];
    this.amount = value[1];
    this.other = value[2];
  }
  toField(): Field {
    return {
      content: [
        {
          content: () => {
            if (this.name) {
              return this.name;
            } else {
              void getBaseJsonItem('item', this.id).then(
                (jsonItem) =>
                  (this.name = jsonItem ? getName(jsonItem) : this.id)
              );
              return this.name ?? this.id;
            }
          },
          contentRoute: {
            name: 'jsonItem',
            params: { jsonType: 'item', jsonId: this.id },
          },
        },
        {
          content: ` x ${this.amount}`,
        },
      ],
      style: FieldStyle.STRING,
    };
  }
}
interface Use {
  id: string;
  amount: number;
  name?: string;
}

export interface RecipeContent {
  result?: string;
  byproducts?: [string, number][];
  category?: string;
  subcategory?: string;
  id_suffix?: string;
  override?: boolean;
  delete_flags?: string[];
  flags?: string[];
  skill_used: string;
  skills_required?: [string, number][];
  book_learn?: Map<string, ContentBookLearn>;
  difficulty?: number;
  time?: number | string;
  reversible?: boolean | { time: string | number };
  autolearn?: boolean | [string, number][];
  decomp_learn?: number | [string, number][];
  activity_level?: string;
  proficiencies?: ContentProficiency[];
  batch_time_factors: [number, number];
  qualities?: ContentQualitie[];
  tools?: [string, number][][];
  using?: [string, number][];
  components?: [string, number, string | undefined][][];
}

export class RecipeFeature {
  result?: string;
  resultName?: string;
  byproducts?: Byproduct[];
  category?: string;
  categoryName?: string;
  subcategory?: string;
  subcategoryName?: string;
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
  proficiencies?: Proficiency[];
  batchTime?: BatchTime;
  qualities?: Qualitie[];
  tools?: Tool[][];
  using?: Use[];
  components?: Component[][];

  constructor(jsonItem: JsonItem) {
    const content = <RecipeContent>jsonItem.content;
    this.result = content.result;
    if (content.byproducts) {
      this.byproducts = [];
      content.byproducts.forEach((byproduct) =>
        this.byproducts?.push(new Byproduct(byproduct))
      );
    }
    this.category = content.category;
    this.subcategory = content.subcategory;
    this.delete_flags = content.delete_flags;
    this.flags = content.flags;
    this.skill_used = content.skill_used;
    this.skills = [];
    if (content.skills_required) {
      content.skills_required.forEach((skillRequire) =>
        this.skills?.push(new SkillUse(skillRequire))
      );
    }
    if (content.book_learn) {
      this.bookLearn = [];
      content.book_learn.forEach((bookLearn, key) =>
        this.bookLearn?.push({
          id: key,
          skill_level: bookLearn.skill_level,
          recipe_name: bookLearn.recipe_name,
          hidden: bookLearn.hidden,
        })
      );
    }
    this.difficulty = content.difficulty;
    this.time =
      (typeof content.time === 'string'
        ? content.time
        : content.time?.toString()) ?? '0';
    if (content.reversible) {
      if (typeof content.reversible === 'object') {
        this.reversible =
          typeof content.reversible.time === 'string'
            ? content.reversible.time
            : content.reversible.time.toString();
      } else {
        this.reversible = this.time;
      }
    } else {
      this.reversible = '0';
    }
    if (content.autolearn) {
      if (typeof content.autolearn === 'boolean') {
        this.autoLearn = this.skills;
      } else {
        this.autoLearn = [];
        content.autolearn.forEach((skill) =>
          this.autoLearn?.push(new SkillUse(skill))
        );
      }
    }
    if (content.decomp_learn) {
      if (typeof content.decomp_learn === 'number') {
        this.decompLearn = [
          new SkillUse([this.skill_used, content.decomp_learn]),
        ];
      } else {
        this.decompLearn = [];
        content.decomp_learn.forEach((skill) =>
          this.decompLearn?.push(new SkillUse(skill))
        );
      }
    }
    this.activityLevel = content.activity_level;
    if (content.proficiencies) {
      this.proficiencies = [];
      content.proficiencies.forEach((proficiencie) =>
        this.proficiencies?.push(new Proficiency(proficiencie))
      );
    }
    if (content.batch_time_factors) {
      this.batchTime = {
        multiplier: content.batch_time_factors[0],
        amount: content.batch_time_factors[1],
      };
    }
    if (content.qualities) {
      this.qualities = content.qualities.map(
        (qualitie) => new Qualitie(qualitie)
      );
    }
    if (content.tools) {
      this.tools = [];
      content.tools.forEach((tools, index) => {
        this.tools?.push([]);
        tools.forEach((tool) => {
          this.tools?.[index].push({ id: tool[0], amount: tool[1] });
        });
      });
    }
    if (content.using) {
      this.using = [];
      content.using.forEach((using) => {
        this.using?.push({ id: using[0], amount: using[1] });
      });
    }
    if (content.components) {
      this.components = [];
      content.components.forEach((components, index) => {
        this.components?.push([]);
        components.forEach((component) => {
          if (component[2] !== 'LIST') {
            this.components?.[index].push(new Component(component));
          } else {
            if (!this.using) {
              this.using = [];
            }
            this.using?.push({ id: component[0], amount: component[1] });
          }
        });
      });
    }
  }
  asyncInit() {
    processUsing(this.using, this);
  }
  toField(): Field {
    return {
      label: i18n.global.t('label.recipe'),
      content: [
        {
          label: i18n.global.t('label.pskill'),
          content: [
            {
              content: () => {
                if (this.skillName) {
                  return this.skillName;
                } else {
                  void getBaseJsonItem('skill', this.skill_used).then(
                    (jsonItem) =>
                      jsonItem
                        ? (this.skillName = getName(jsonItem))
                        : (this.skillName = this.skill_used)
                  );
                  return this.skillName ?? this.skill_used;
                }
              },
            },
            {
              content: `(${this.difficulty ?? 0})`,
            },
          ],
          style: FieldStyle.STRING,
        },
        {
          label: i18n.global.t('label.skills'),
          content: this.skills.map((skill) => skill.toField()),
        },
        {
          label: i18n.global.t('label.byproducts'),
          content:
            this.byproducts?.map((value) => {
              return value.toField();
            }) ?? '',
        },
        {
          label: i18n.global.t('label.time'),
          content: this.time,
        },
        {
          label: i18n.global.t('label.batch_time'),
          content: this.batchTime
            ? `min amount: ${this.batchTime.amount}, time: ${this.batchTime.multiplier}`
            : '',
        },
        {
          label: i18n.global.t('label.proficiency'),
          content:
            this.proficiencies?.map((proficiency) => proficiency.toField()) ??
            '',
        },
        {
          label: i18n.global.t('label.tools'),
          content: this.qualities?.map((qualitie) => qualitie.toField()) ?? '',
        },
        {
          label: i18n.global.t('label.components'),
          content:
            this.components?.map((components) => {
              return {
                content: components.map((component) => component.toField()),
                style: FieldStyle.STRING,
                separator: ' OR ',
              };
            }) ?? '',
        },
      ],
    };
  }
}

function processUsing(
  cUsing: Use[] | undefined,
  recipe: RecipeFeature,
  amount?: number
) {
  if (cUsing) {
    cUsing.forEach((using) => {
      void getBaseJsonItem('requirement', using.id).then((jsonItem) => {
        if (jsonItem) {
          const requirement = new RecipeFeature(jsonItem);
          if (requirement.proficiencies) {
            if (!recipe.proficiencies) {
              recipe.proficiencies = [];
            }
            recipe.proficiencies.push(...requirement.proficiencies);
          }
          if (requirement.tools) {
            if (!recipe.tools) {
              recipe.tools = [];
            }
            recipe.tools.push(...requirement.tools);
          }
          if (requirement.qualities) {
            if (!recipe.qualities) {
              recipe.qualities = [];
            }
            recipe.qualities.push(...requirement.qualities);
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
