import { getJsonItemListByJsonId } from 'src/api';
import { getName } from 'src/utils/JsonItemUtil';

export interface QualitiesContent {
  qualities?: [string, number][];
}

export class QualitiesFeature {
  qualities: [string, number][];
  constructor(jsonItem: JsonItem) {
    const qualitiesContent = jsonItem.content as QualitiesContent;
    if (qualitiesContent.qualities) {
      this.qualities = qualitiesContent.qualities;
      for (const qualitie of this.qualities) {
        void getJsonItemListByJsonId('tool_quality', qualitie[0]).then(
          (jsonItems) => (qualitie[0] = getName(jsonItems[0]))
        );
      }
    } else {
      this.qualities = [];
    }
  }
}
