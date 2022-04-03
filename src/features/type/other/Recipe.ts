import { Field, FieldStyle } from 'src/type/FieldType';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';

interface ContentBookLearn {
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
}

interface ContentProficiency {
  proficiency?: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
}

interface ContentQualitie {
  id?: string;
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

interface SkillUse {
  id: string;
  level: number;
  name?: string;
}

interface BookLearn {
  id: string;
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
  name?: string;
}

interface Proficiency {
  proficiency?: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
  name?: string;
}

interface BatchTime {
  multiplier: number;
  amount: number;
}

interface Qualitie {
  id: string;
  level: number;
  amount?: number;
  name?: string;
}

interface Tool {
  id: string;
  amount: number;
  name?: string;
}
interface Component {
  id: string;
  amount: number;
  name?: string;
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
  components?: [string, number][][];
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
        this.skills?.push({ id: skillRequire[0], level: skillRequire[1] })
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
          this.autoLearn?.push({ id: skill[0], level: skill[1] })
        );
      }
    }
    if (content.decomp_learn) {
      if (typeof content.decomp_learn === 'number') {
        this.decompLearn = [
          { id: this.skill_used, level: content.decomp_learn },
        ];
      } else {
        this.decompLearn = [];
        content.decomp_learn.forEach((skill) =>
          this.decompLearn?.push({ id: skill[0], level: skill[1] })
        );
      }
    }
    this.activityLevel = content.activity_level;
    this.proficiencies = content.proficiencies;
    if (content.batch_time_factors) {
      this.batchTime = {
        multiplier: content.batch_time_factors[0],
        amount: content.batch_time_factors[1],
      };
    }
    if (content.qualities) {
      this.qualities = content.qualities as Qualitie[];
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
        components.forEach((Component) => {
          this.components?.[index].push({
            id: Component[0],
            amount: Component[1],
          });
        });
      });
    }
  }
  toField(): Field {
    return {
      label: 'Recipe:',
      content: [
        {
          label: 'result',
          content: () => {
            if (this.resultName) {
              return this.resultName;
            } else {
              this.resultName = this.result;
              if (this.result) {
                void getBaseJsonItem('item', this.result).then(
                  (jsonItem) =>
                    (this.resultName = jsonItem
                      ? getName(jsonItem)
                      : this.result)
                );
              }
              return this.resultName ?? '';
            }
          },
          contentRoute: {
            name: 'jsonItem',
            params: { jsonType: 'item', jsonId: this.result },
          },
        },
        {
          label: 'byproducts',
          content:
            this.byproducts?.map((value) => {
              return value.toField();
            }) ?? '',
        },
        {
          label: 'time',
          content: this.time,
        },
        {
          label: 'batch time',
          content: this.batchTime
            ? `min amount: ${this.batchTime.amount}, time: ${this.batchTime.multiplier}`
            : '',
        },
        {
          label: 'Tools',
          content:
            this.qualities?.map((qualitie) => {
              return {
                content: `${qualitie.id} (${qualitie.level}) x ${
                  qualitie.amount ?? 1
                }`,
              };
            }) ?? '',
        },
        {
          label: 'Components',
          content:
            this.components?.map((components) => {
              return {
                content: components.map((component) => {
                  return { content: `${component.id} x ${component.amount}` };
                }),
              };
            }) ?? '',
        },
      ],
    };
  }
}
