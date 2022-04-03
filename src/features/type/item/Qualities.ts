import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';

export interface QualitiesContent {
  qualities?: [string, number][];
}

interface qualitieInterface {
  id: string;
  level: number;
  name?: string;
}
export class QualitiesFeature {
  qualities: qualitieInterface[];
  constructor(jsonItem: JsonItem) {
    const qualitiesContent = jsonItem.content as QualitiesContent;
    this.qualities = [];
    if (qualitiesContent.qualities) {
      qualitiesContent.qualities.forEach((qualitie) => {
        this.qualities.push({ id: qualitie[0], level: qualitie[1] });
      });
    }
    if (!jsonItem.feature) {
      jsonItem.feature = new Map<string, object>();
    }
    jsonItem.feature.set('qualities', this);
  }
  getName(index: number): string | undefined {
    const qualitie = this.qualities[index];
    if (!qualitie.name) {
      void getBaseJsonItem('tool_quality', qualitie.id).then((jsonItem) => {
        if (jsonItem) {
          qualitie.name = getName(jsonItem);
        }
      });
    }
    return this.qualities[index].name;
  }
}
