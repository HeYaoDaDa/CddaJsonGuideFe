import { QBadge } from 'quasar';
import MyCard from 'src/components/myComponents/MyCard.vue';
import MyText from 'src/new/components/MyText/MyText.vue';
import MyField from 'src/new/components/MyField.vue';
import { isItem } from 'src/utils/JsonItemUtil';
import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import { Explosion } from '../explosion/Explosion';
import { Flag } from '../FlagsContant';
import { getGetTextTransationString, parseGetTextTransation } from '../GetText';
import {
  getArray,
  getLength,
  getOptionalArray,
  getOptionalAsyncName,
  getOptionalUnknown,
  getString,
  getVolume,
  getWeight,
} from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { Armor } from './Armor';
import { PocketData } from './PocketData';
import {
  foreachVNode,
  lengthToString,
  VolumeToString,
  weightToString,
} from 'src/utils/DataUtil';

export class ItemBase extends SuperData<ItemBaseInterface> {
  jsonObject?: JsonItem;
  constructor(value: JsonItem | undefined) {
    super(value);
    this.jsonObject = value;
    if (value && this.validateValue(value)) {
      this.parseJson(value.content);
      this.load();
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
            h(MyField, { label: 'weight' }, () =>
              h(MyText, { content: weightToString(item.weight) })
            ),
            h(MyField, { label: 'volume' }, () =>
              h(MyText, { content: VolumeToString(item.volume) })
            ),
            h(MyField, { label: 'length' }, () =>
              h(MyText, { content: lengthToString(item.longestSide) })
            ),
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

    if (item.armor) {
      result.push(...item.armor.getView());
    }

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

    data.name = getGetTextTransationString(
      parseGetTextTransation(getOptionalUnknown(jsonObject, 'name'))
    );
    data.description = getGetTextTransationString(
      parseGetTextTransation(getOptionalUnknown(jsonObject, 'description'))
    );
    data.symbol = getString(jsonObject, 'symbol');
    data.color = getString(jsonObject, 'color');
    data.weight = getWeight(jsonObject, 'weight');
    data.volume = getVolume(jsonObject, 'volume');
    data.longestSide = getLength(jsonObject, 'longest_side', -1);
    data.category =
      getOptionalAsyncName(jsonObject, 'category', CddaType.itemCategory) ??
      calcCategory();
    data.pockets = getOptionalArray(jsonObject, 'pocket_data')?.map(
      (pocketData) => new PocketData(pocketData as object)
    );
    data.flags = getArray(jsonObject, 'flags', []).map(
      (flag) => new AsyncName(<string>flag, CddaType.flag)
    );
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
          data.materials.push([
            new AsyncName(material.type, CddaType.material),
            material.portion ?? 1,
          ]);
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
  }

  private load() {
    const data = this.data;
    if (data.longestSide < 0) {
      //TODO should as effective volume in ammo and comestible or stackable
      data.longestSide = Math.round(Math.cbrt(data.volume));
    }
    if (
      this.jsonObject &&
      new Armor(undefined).validateValue(this.jsonObject)
    ) {
      data.armor = new Armor(this.jsonObject);
      data.armor.load(this);
    }
  }

  public hasFlag(flag: Flag) {
    return this.data.flags.some((myflag) => myflag.value.id === flag);
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
  //aslo is lenght
  longestSide: number;

  category: AsyncName;

  flags: AsyncName[];

  armor?: Armor;

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
  weaponCategory?: AsyncName;
  qualities?: [AsyncName, number][];
  chargedQualities?: [AsyncName, number][];
  properties?: Map<AsyncName, string>;
  defaultMaterial: AsyncName;
  ammoScale: Map<string, number>;
  emits: AsyncName[];
  techniques: AsyncName[];
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
