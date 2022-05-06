import { QBadge } from 'quasar';
import { getJsonItemsByItemType } from 'src/api';
import JsonCard from 'src/components/jsonItem/JsonCard.vue';
import MyCard from 'src/components/myComponents/MyCard.vue';
import MyField from 'src/new/components/MyField.vue';
import MyText from 'src/new/components/MyText/MyText.vue';
import { isEmpty, isNotEmpty } from 'src/utils';
import { foreachVNode, lengthToString, volumeToString, weightToString } from 'src/utils/DataUtil';
import { isItem } from 'src/utils/JsonItemUtil';
import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import { Explosion } from '../explosion/Explosion';
import { Flag } from '../FlagsContant';
import { getGetTextTransationString, parseGetTextTransation } from '../GetText';
import {
  getArray,
  getLength,
  getNumber,
  getOptionalArray,
  getOptionalAsyncName,
  getOptionalUnknown,
  getString,
  getVolume,
  getWeight,
} from '../JsonUtil';
import { Recipe } from '../recipe/Recipe';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { Armor } from './Armor';
import { PocketData } from './PocketData';
import { numToHitObject, ToHitInterface } from './ToHitObject';

export class ItemBase extends SuperData<ItemBaseInterface> {
  jsonObject?: JsonItem;
  constructor(value: JsonItem | undefined) {
    super(value);
    this.jsonObject = value;
    if (value && this.validateValue(value)) {
      this.parseJson(value.content);
      this.load().catch((e) => console.error(e));
    }
  }

  validateValue(value: JsonItem): boolean {
    return isItem(value.type);
  }

  getView(): VNode[] {
    const result: VNode[] = [];
    const item = this.data;

    result.push(
      h(
        MyCard,
        { width: '-webkit-fill-available' },
        {
          befor: () => [
            nameInfo(this.jsonObject?.mod),
            h(MyText, {
              content: item.description,
              p: true,
            }),
          ],
          default: () => [
            h(MyField, { label: 'material' }, () =>
              foreachVNode(
                item.materials,
                (material) => [
                  h(MyText, {
                    content: material[0].getName(),
                    route: material[0].route,
                  }),
                  h(MyText, { content: `(${material[1]})` }),
                ],
                ', '
              )
            ),
            h(MyField, { label: 'weight' }, () => h(MyText, { content: weightToString(item.weight) })),
            h(MyField, { label: 'volume' }, () => h(MyText, { content: volumeToString(item.volume) })),
            h(MyField, { label: 'length' }, () => h(MyText, { content: lengthToString(item.longestSide) })),
            h(MyField, { label: 'category' }, () =>
              h(MyText, {
                content: item.category.getName(),
                route: item.category.route,
              })
            ),
            h(MyField, { label: 'flag', ul: true }, () =>
              foreachVNode(item.flags, (flag) => [
                h(MyText, {
                  content: flag.getName(),
                  route: flag.route,
                  li: true,
                }),
              ])
            ),
          ],
        }
      )
    );

    result.push(
      h(MyCard, { label: 'attack' }, () => [
        h(MyField, { label: 'bash' }, () => h(MyText, { content: item.bash })),
        h(MyField, { label: this.isStab() ? 'stab' : 'cut' }, () => h(MyText, { content: item.cut })),
        h(MyField, { label: 'toHit' }, () => h(MyText, { content: item.ToHitNum })),
        h(MyField, { label: 'baseMovesPerAttack' }, () => h(MyText, { content: item.baseMovesPerAttack })),
        h(
          MyField,
          {
            label: 'weaponCategory',
            isHide: isEmpty(item.weaponCategory),
          },
          () =>
            h(MyText, {
              content: item.weaponCategory.map((v) => v.getName()),
              route: item.weaponCategory.map((v) => v.route),
              separator: ', ',
            })
        ),
        h(MyField, { label: 'techniques', isHide: isEmpty(item.techniques) }, () =>
          h(MyText, {
            content: item.techniques.map((v) => v.getName()),
            route: item.techniques.map((v) => v.route),
            separator: ', ',
          })
        ),
      ])
    );

    if (item.armor) {
      result.push(...item.armor.getView());
    }

    if (isNotEmpty(item.recipes)) {
      result.push(...item.recipes.map((recipe) => recipe.getView()[0]));
    }

    result.push(h(JsonCard, { jsonItem: this.jsonObject }));

    return result;

    function nameInfo(mod: string | undefined) {
      return h('p', {}, [
        h(
          'span',
          {
            class: 'text-weight-bold text-h4',
            style: { color: item.color },
          },
          item.symbol
        ),
        h(
          'span',
          {
            class: 'text-weight-bold text-h3',
          },
          item.name
        ),
        h(
          QBadge,
          {
            class: 'text-h4',
          },
          () => mod
        ),
      ]);
    }
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.name = getGetTextTransationString(parseGetTextTransation(getOptionalUnknown(jsonObject, 'name')));
    data.description = getGetTextTransationString(
      parseGetTextTransation(getOptionalUnknown(jsonObject, 'description'))
    );
    data.symbol = getString(jsonObject, 'symbol');
    data.color = getString(jsonObject, 'color');
    data.weight = getWeight(jsonObject, 'weight');
    data.volume = getVolume(jsonObject, 'volume');
    data.longestSide = getLength(jsonObject, 'longest_side', -1);
    data.category = getOptionalAsyncName(jsonObject, 'category', CddaType.itemCategory) ?? calcCategory();
    data.pockets = getOptionalArray(jsonObject, 'pocket_data')?.map(
      (pocketData) => new PocketData(pocketData as object)
    );
    data.flags = getArray(jsonObject, 'flags', []).map((flag) => new AsyncName(<string>flag, CddaType.flag));

    data.bash = getNumber(jsonObject, 'bashing');
    data.cut = getNumber(jsonObject, 'cutting');
    assginToHitNum();
    data.weaponCategory = getArray(jsonObject, 'weapon_category').map(
      (value) => new AsyncName(<string>value, CddaType.weaponCategory)
    );
    data.techniques = getArray(jsonObject, 'techniques').map(
      (value) => new AsyncName(<string>value, CddaType.technique)
    );
    calcBaseMovesPerAttack();

    assginMaterialsAndMaterialPortionsTotal();

    function assginMaterialsAndMaterialPortionsTotal() {
      data.materials = [];
      data.materialPortionsTotal = 0;
      getOptionalArray(jsonObject, 'material')?.forEach((temp) => {
        let portion = 1;
        if (typeof temp === 'string') {
          data.materials.push([new AsyncName(temp, CddaType.material), 1]);
        } else {
          const material = temp as { type: string; portion?: number };
          data.materials.push([new AsyncName(material.type, CddaType.material), material.portion ?? 1]);
          portion = material.portion ?? 1;
        }
        data.materialPortionsTotal += portion;
      });
    }
    function calcCategory(): AsyncName {
      //TODO
      if (data.armor) {
        return new AsyncName('clothing', CddaType.itemCategory);
      }
      return new AsyncName('other', CddaType.itemCategory);
    }
    function assginToHitNum() {
      const temp = getOptionalUnknown(jsonObject, 'to_hit');
      if (temp) {
        if (typeof temp === 'number') {
          data.ToHitNum = temp;
        } else {
          data.ToHitNum = numToHitObject(temp as ToHitInterface);
        }
      } else {
        data.ToHitNum = 0;
      }
    }
    function calcBaseMovesPerAttack() {
      data.baseMovesPerAttack = 65 + Math.floor(data.volume / 62.5) + Math.floor(data.weight / 60);
    }
  }

  private load() {
    const data = this.data;
    if (data.longestSide < 0) {
      //TODO should as effective volume in ammo and comestible or stackable
      data.longestSide = Math.round(Math.cbrt(data.volume));
    }
    if (this.jsonObject && new Armor(undefined).validateValue(this.jsonObject)) {
      data.armor = new Armor(this.jsonObject);
      data.armor.load(this);
    }
    return this.loadRecipes();
  }

  public async loadRecipes() {
    this.data.recipes = [];
    const jsonItems = await getJsonItemsByItemType(CddaType.recipe, [
      {
        $match: {
          'content.result': this.jsonObject?.jsonId ?? 'null',
        },
      },
    ]);
    if (isNotEmpty(jsonItems)) {
      this.data.recipes = jsonItems.map((jsonItem) => new Recipe(jsonItem));
    }
  }

  public hasFlag(flag: Flag) {
    return this.data.flags.some((myflag) => myflag.value.id === flag);
  }

  public isStab() {
    return this.hasFlag(Flag.SPEAR) || this.hasFlag(Flag.STAB);
  }
}

interface ItemBaseInterface {
  name: string;
  description: string;
  symbol: string;
  color: string;

  pockets?: PocketData[];

  materials: [AsyncName, number][];
  materialPortionsTotal: number;

  weight: number;
  volume: number;
  longestSide: number;

  category: AsyncName;

  flags: AsyncName[];

  //melee
  bash: number;
  cut: number;
  ToHitNum: number;
  weaponCategory: AsyncName[];
  techniques: AsyncName[];
  baseMovesPerAttack: number;

  //slots
  armor?: Armor;
  recipes: Recipe[];

  //*****TODO*****
  integralWeight: number;
  chatTopics?: string[];
  looksLike?: AsyncName;
  repairsLike?: AsyncName;
  snippetCategory?: string;
  pictureId?: string;
  categoryForce: AsyncName;
  sym: string;
  templateRequirementId?: string;
  defaultContainer?: AsyncName;
  qualities?: [AsyncName, number][];
  chargedQualities?: [AsyncName, number][];
  properties?: Map<AsyncName, string>;
  defaultMaterial: AsyncName;
  ammoScale: Map<string, number>;
  emits: AsyncName[];
  minSkills: [AsyncName, number][];
  repair: AsyncName[];
  faults: AsyncName[];
  magazines: Map<AsyncName, AsyncName[]>;
  nanofabTemplateGroup: AsyncName;
  explosion: Explosion;
  minStr: number;
  minDex: number;
  minInt: number;
  minPer: number;
}
