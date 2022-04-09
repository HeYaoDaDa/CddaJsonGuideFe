import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName, isItem } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

interface GeneralContent {
  material?: string | string[];
  volume?: string | number;
  weight?: string | number;
  length?: string | number;
  category?: string;
}

interface GeneralFeature {
  materials: { id: string; name?: string }[];
  volume: string;
  weight: string;
  length: string;
  category?: string;
  categoryName?: string;
}

export function initGeneralFeature(jsonItem: JsonItem): GeneralFeature {
  const generalFeature = reactive({} as GeneralFeature);
  const generalContent = jsonItem.content as GeneralContent;
  if (generalContent.material) {
    generalFeature.materials = reactive(
      (typeof generalContent.material === 'string'
        ? [generalContent.material]
        : generalContent.material
      ).map((id) => {
        return { id };
      })
    );
  } else {
    generalFeature.materials = [];
  }
  if (generalContent.volume) {
    generalFeature.volume =
      typeof generalContent.volume === 'string'
        ? generalContent.volume
        : generalContent.volume.toString();
  } else {
    generalFeature.volume = '';
  }
  if (generalContent.weight) {
    generalFeature.weight =
      typeof generalContent.weight === 'string'
        ? generalContent.weight
        : generalContent.weight.toString();
  } else {
    generalFeature.weight = '';
  }
  if (generalContent.length) {
    generalFeature.length =
      typeof generalContent.length === 'string'
        ? generalContent.length
        : generalContent.length.toString();
  } else {
    generalFeature.length = '23 cm';
  }
  generalFeature.category = generalContent.category;

  initCategoryName(generalFeature, jsonItem);
  initMaterialName(generalFeature);
  return generalFeature;
}

function initCategoryName(generalFeature: GeneralFeature, jsonItem: JsonItem) {
  if (generalFeature.category && !generalFeature.categoryName) {
    generalFeature.categoryName = generalFeature.category;
    if (isItem(jsonItem.type)) {
      void getBaseJsonItem('item_category', generalFeature.category).then(
        (jsonItem) => {
          if (jsonItem && generalFeature.categoryName) {
            generalFeature.categoryName = getName(jsonItem);
          }
        }
      );
    }
  }
}

function initMaterialName(generalFeature: GeneralFeature) {
  generalFeature.materials.forEach((material, index) => {
    void getBaseJsonItem('material', material.id).then((jsonItem) => {
      if (jsonItem) {
        generalFeature.materials[index].name = getName(jsonItem);
      }
    });
  });
}
