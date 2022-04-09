import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName, isItem } from 'src/utils/JsonItemUtil';
import { reactive, ref, Ref } from 'vue';

export interface GeneralContent {
  material?: string | string[];
  volume?: string | number;
  weight?: string | number;
  length?: string | number;
  category?: string;
}

export class GeneralFeature {
  materials: { id: string; name?: string }[];
  volume: string;
  weight: string;
  length: string;
  category?: string;
  categoryName?: Ref<string>;
  constructor(jsonItem: JsonItem) {
    const generalContent = jsonItem.content as GeneralContent;
    if (generalContent.material) {
      this.materials = reactive(
        (typeof generalContent.material === 'string'
          ? [generalContent.material]
          : generalContent.material
        ).map((id) => {
          return { id };
        })
      );
    } else {
      this.materials = [];
    }
    if (generalContent.volume) {
      this.volume =
        typeof generalContent.volume === 'string'
          ? generalContent.volume
          : generalContent.volume.toString();
    } else {
      this.volume = '';
    }
    if (generalContent.weight) {
      this.weight =
        typeof generalContent.weight === 'string'
          ? generalContent.weight
          : generalContent.weight.toString();
    } else {
      this.weight = '';
    }
    if (generalContent.length) {
      this.length =
        typeof generalContent.length === 'string'
          ? generalContent.length
          : generalContent.length.toString();
    } else {
      this.length = '23 cm';
    }
    this.category = generalContent.category;

    this.initCategoryName(jsonItem);
    this.initMaterialName();
  }

  private initCategoryName(jsonItem: JsonItem) {
    if (this.category && !this.categoryName) {
      this.categoryName = ref(this.category);
      if (isItem(jsonItem.type)) {
        void getBaseJsonItem('item_category', this.category).then(
          (jsonItem) => {
            if (jsonItem && this.categoryName) {
              this.categoryName.value = getName(jsonItem);
            }
          }
        );
      }
    }
  }

  private initMaterialName() {
    this.materials.forEach((material, index) => {
      void getBaseJsonItem('material', material.id).then((jsonItem) => {
        if (jsonItem) {
          this.materials[index].name = getName(jsonItem);
        }
      });
    });
  }
}
