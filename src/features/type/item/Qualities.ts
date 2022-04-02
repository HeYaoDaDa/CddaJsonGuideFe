import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';

export interface QualitiesContent {
  qualities?: [string, number][];
}

export class QualitiesFeature {
  qualities: [string, number, string | undefined][];
  constructor(jsonItem: JsonItem) {
    const qualitiesContent = jsonItem.content as QualitiesContent;
    this.qualities = [];
    if (qualitiesContent.qualities) {
      qualitiesContent.qualities.forEach((qualitie, index) => {
        this.qualities.push([qualitie[0], qualitie[1], undefined]);
        void getBaseJsonItem('tool_quality', qualitie[0]).then((jsonItem) => {
          if (jsonItem) {
            this.qualities[index][2] = getName(jsonItem);
          }
        });
      });
    }
    if (!jsonItem.feature) {
      jsonItem.feature = new Map<string, object>();
    }
    jsonItem.feature.set('qualities', this);
  }
  getName(index: number): string | undefined {
    const qualitie = this.qualities[index];
    void getBaseJsonItem('tool_quality', qualitie[0]).then((jsonItem) => {
      if (jsonItem) {
        qualitie[2] = getName(jsonItem);
      }
    });
    return qualitie[2];
  }
}
