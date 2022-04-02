import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';

export interface GeneralContent {
  material?: string | string[];
  volume?: string | number;
  weight?: string | number;
  length?: string | number;
  category?: string;
}

export class GeneralFeature {
  materials: string[];
  volume: string;
  weight: string;
  length: string;
  category?: string;
  categoryName?: string;
  constructor(jsonItem: JsonItem) {
    const generalContent = jsonItem.content as GeneralContent;
    if (generalContent.material) {
      this.materials =
        typeof generalContent.material === 'string'
          ? [generalContent.material]
          : generalContent.material;
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
      this.length = '';
    }
    this.category = generalContent.category;

    this.materials.forEach((material, index) => {
      void getBaseJsonItem('material', material).then((jsonItem) => {
        if (jsonItem) {
          this.materials[index] = getName(jsonItem);
        }
      });
    });
  }
  getCategoryName() {
    if (this.category && !this.categoryName) {
      void getBaseJsonItem('item_category', this.category).then((jsonItem) => {
        if (jsonItem) {
          this.categoryName = getName(jsonItem);
        }
      });
    }
    return this.categoryName;
  }
}
