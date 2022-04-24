import { VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import { Explosion } from '../explosion/Explosion';
import { Flag } from '../FlagsContant';
import { getArray, getOptionalArray } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';
import { PocketData } from './PocketData';

export class ItemBase extends SuperData<ItemBaseInterface> {
  constructor(value: object) {
    super(value);
    this.parseJson(value);
  }
  getView(): VNode[] {
    return [];
  }
  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.pockets = getOptionalArray(jsonObject, 'pocket_data')?.map(
      (pocketData) => new PocketData(pocketData as object)
    );

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

    data.flags = getArray(jsonObject, 'flags', []).map(
      (flag) => new AsyncName(<string>flag, CddaType.flag)
    );
  }
  public hasFlag(flag: Flag) {
    return this.data.flags.some((myflag) => myflag.value.id === flag);
  }
}

interface ItemBaseInterface {
  // pind fill, use action

  weight: number;
  integralWeight: number;

  // pind fill, src,variants,thrown_damage,recipes

  pockets?: PocketData[];
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
  materials: [AsyncName, number][];
  defaultMaterial: AsyncName;
  ammoScale: Map<string, number>;
  emits: AsyncName[];
  techniques: AsyncName[];
  minSkills: [AsyncName, number][];
  repair: AsyncName[];
  faults: AsyncName[];
  magazines: Map<AsyncName, AsyncName[]>;
  nanofabTemplateGroup: AsyncName;
  flags: AsyncName[];
  description: string;
  explosion: Explosion;
  materialPortionsTotal: number;
  minStr: number;
  minDex: number;
  minInt: number;
  minPer: number;
  // pind
}
