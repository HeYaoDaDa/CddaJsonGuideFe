import MyCard from 'src/components/myComponents/MyCard.vue';
import MyField from 'src/new/components/MyField.vue';
import MyText from 'src/new/components/MyText/MyText.vue';
import { isNotEmpty } from 'src/utils';
import { TimeToString } from 'src/utils/DataUtil';
import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import {
  getArray,
  getBoolean,
  getNumber,
  getOptionalArray,
  getOptionalAsyncName,
  getOptionalUnknown,
  getString,
  getTime,
} from '../JsonUtil';
import { Requirement } from '../requirement/Requirement';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { RecipeProficiency } from './RecipeProficiency';

export class Recipe extends SuperData<RecipeInterface> {
  constructor(value: JsonItem | undefined) {
    super(value);
    if (value && this.validateValue(value)) {
      this.parseJson(value.content);
    }
  }

  validateValue(value: JsonItem): boolean {
    return value.type === CddaType.recipe;
  }

  getView(): VNode[] {
    const result: VNode[] = [];
    const data = this.data;

    result.push(
      h(MyField, { label: 'result' }, () => h(MyText, { content: data.result?.getName(), route: data.result?.route })),
      h(MyField, { label: 'byproducts' }, () => {
        const result = new Array<VNode>();
        data.byproducts.forEach((byproduct) => {
          result.push(
            h(MyText, {
              content: byproduct[0].getName(),
              route: byproduct[0].route,
            }),
            h(MyText, {
              content: ` x ${byproduct[1]}`,
            })
          );
        });
        return result;
      }),
      h(MyField, { label: 'time' }, () => h(MyText, { content: TimeToString(data.time) })),
      h(MyField, { label: 'skillUse' }, () => [
        h(MyText, { content: data.skillUse.getName(), route: data.skillUse.route }),
        h(MyText, { content: `(${data.difficulty})` }),
      ])
    );
    result.push(
      h(MyField, { label: 'activity' }, () => h(MyText, { content: data.activity })),
      h(MyField, { label: 'neverLearn' }, () => h(MyText, { content: data.neverLearn }))
    );
    if (isNotEmpty(data.skillRequire)) {
      result.push(
        h(MyField, { label: 'skillRequire' }, () => {
          const result = new Array<VNode>();
          data.skillRequire.forEach((skill) => {
            result.push(
              h(MyText, {
                content: skill[0].getName(),
                route: skill[0].route,
              }),
              h(MyText, {
                content: `(${skill[1]})`,
              })
            );
          });
          return result;
        })
      );
    }
    if (isNotEmpty(data.proficiencies)) {
      result.push(
        h(MyField, { label: 'proficiencies', ul: true }, () =>
          data.proficiencies.map((proficiency) => proficiency.getView()[0])
        )
      );
    }
    result.push(...data.requirement.getView());
    if (isNotEmpty(data.autolearnRequire)) {
      result.push(
        h(MyField, { label: 'autoLearn' }, () => {
          const result = new Array<VNode>();
          data.autolearnRequire.forEach((skill) => {
            result.push(
              h(MyText, {
                content: skill[0].getName(),
                route: skill[0].route,
              }),
              h(MyText, {
                content: `(${skill[1]})`,
              })
            );
          });
          return result;
        })
      );
    }
    if (isNotEmpty(data.decompLearn)) {
      result.push(
        h(MyField, { label: 'decompLearn' }, () => {
          const result = new Array<VNode>();
          data.decompLearn.forEach((skill) => {
            result.push(
              h(MyText, {
                content: skill[0].getName(),
                route: skill[0].route,
              }),
              h(MyText, {
                content: `(${skill[1]})`,
              })
            );
          });
          return result;
        })
      );
    }
    if (isNotEmpty(data.bookLearn)) {
      result.push(
        h(MyField, { label: 'bookLearn' }, () => {
          const result = new Array<VNode>();
          data.bookLearn.forEach((skill) => {
            result.push(
              h(MyText, {
                content: skill[0].getName(),
                route: skill[0].route,
              }),
              h(MyText, {
                content: `(${skill[1]})`,
              })
            );
          });
          return result;
        })
      );
    }
    if (data.batchScale < 100) {
      result.push(
        h(MyField, { label: 'batch_time' }, () => h(MyText, { content: data.batchScale.toString() + '%' })),
        h(MyField, { label: 'size' }, () => h(MyText, { content: data.batchSize }))
      );
    }
    return [h(MyCard, { label: 'recipe' }, () => result)];
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.result = getOptionalAsyncName(jsonObject, 'result', CddaType.item);
    data.obsolete = getBoolean(jsonObject, 'obsolete');
    if (data.obsolete) return;
    data.byproducts = getArray(jsonObject, 'byproducts').map((byproduct) => {
      const temp = <[string, number | undefined]>byproduct;
      return [new AsyncName(temp[0], CddaType.item), temp[1] ?? 1];
    });
    parseTime();

    data.skillUse = getOptionalAsyncName(jsonObject, 'skill_used', CddaType.skill) ?? ({} as AsyncName);
    data.difficulty = getNumber(jsonObject, 'difficulty');
    data.skillRequire = getArray(jsonObject, 'skills_required').map((skill) => {
      const temp = <[string, number | undefined]>skill;
      return [new AsyncName(temp[0], CddaType.skill), temp[1] ?? 0];
    });
    data.activity = getString(jsonObject, 'activity_level');
    data.neverLearn = getBoolean(jsonObject, 'never_learn');
    parseAutoLearn();
    parseDecompLearn();
    parseBookLearn();

    parseBatch();

    parseProficiencies();
    parseRequirement().catch((e) => console.error(e));

    function parseTime() {
      const temp = getOptionalUnknown(jsonObject, 'time');
      if (temp && typeof temp === 'number') {
        data.time = Math.round(temp * 0.01);
      } else {
        data.time = getTime(jsonObject, 'time');
      }
    }
    // after skillUse and difficulty
    function parseAutoLearn() {
      const temp = getOptionalUnknown(jsonObject, 'autolearn');
      data.autolearnRequire = [];
      if (temp) {
        if (typeof temp === 'boolean') {
          if (temp) {
            data.autolearnRequire.push([data.skillUse, data.difficulty]);
          }
        } else {
          const learnJsons = temp as [string, number][];
          data.autolearnRequire = learnJsons.map((learnJson) => [
            new AsyncName(learnJson[0], CddaType.skill),
            learnJson[1],
          ]);
        }
      }
    }
    // after skillUse
    function parseDecompLearn() {
      const temp = getOptionalUnknown(jsonObject, 'decomp_learn');
      data.decompLearn = [];
      if (temp) {
        if (typeof temp === 'number') {
          data.decompLearn.push([data.skillUse, temp]);
        } else {
          const learnJsons = temp as [string, number][];
          data.decompLearn = learnJsons.map((learnJson) => [new AsyncName(learnJson[0], CddaType.skill), learnJson[1]]);
        }
      }
    }
    function parseBatch() {
      const batchTuple = getOptionalUnknown(jsonObject, 'batch_time_factors') as undefined | [number, number];
      if (batchTuple) {
        data.batchScale = batchTuple[0];
        data.batchSize = batchTuple[1];
      } else {
        data.batchScale = 100;
        data.batchSize = 1;
      }
    }
    function parseBookLearn() {
      const bookLearnJson = getOptionalUnknown(jsonObject, 'book_learn') as
        | undefined
        | Map<string, BookLearnJson>
        | [string, number][];
      data.bookLearn = [];
      if (bookLearnJson !== undefined) {
        if (Array.isArray(bookLearnJson)) {
          bookLearnJson.forEach((bookLearnTuple) =>
            data.bookLearn.push([new AsyncName(bookLearnTuple[0], CddaType.item), bookLearnTuple[1], undefined, false])
          );
        } else {
          bookLearnJson.forEach((bookLearnObject, bookId) =>
            data.bookLearn.push([
              new AsyncName(bookId, CddaType.item),
              bookLearnObject.skill_level,
              bookLearnObject.recipe_name,
              bookLearnObject.hidden ?? false,
            ])
          );
        }
      }
    }
    function parseProficiencies() {
      const proficiencies = getOptionalArray(jsonObject, 'proficiencies') as object[] | undefined;
      data.proficiencies = [];
      if (proficiencies && isNotEmpty(proficiencies)) {
        data.proficiencies = proficiencies.map((proficiency) => new RecipeProficiency(proficiency));
      }
    }
    async function parseRequirement() {
      data.requirement = new Requirement(jsonObject);
      return data.requirement.load();
    }
  }
}

interface RecipeInterface {
  result?: AsyncName;
  byproducts: [AsyncName, number][];
  time: number;
  skillUse: AsyncName;
  difficulty: number;
  skillRequire: [AsyncName, number][];

  activity: string;

  neverLearn: boolean;
  autolearnRequire: [AsyncName, number][];
  decompLearn: [AsyncName, number][];
  //book,skill,name,hidden
  bookLearn: [AsyncName, number, string | undefined, boolean][];

  proficiencies: RecipeProficiency[];
  requirement: Requirement;
  obsolete: boolean;
  flags: AsyncName[];

  //automatically set contained if we specify as container
  contained: boolean;
  sealed: boolean;
  container: AsyncName;

  batchScale: number;
  batchSize: number;

  charges: number;
  resultMult: number;
}

interface BookLearnJson {
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
}
