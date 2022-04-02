import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
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
        void getBaseJsonItem('tool_quality', qualitie[0]).then((jsonItem) => {
          if (jsonItem) {
            qualitie[0] = getName(jsonItem);
          }
        });
      }
    } else {
      this.qualities = [];
    }
  }
}
