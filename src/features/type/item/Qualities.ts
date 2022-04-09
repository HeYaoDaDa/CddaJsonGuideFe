import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName, isItem } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

export interface QualitiesContent {
  qualities?: [string, number][];
}

interface qualitieInterface {
  id: string;
  level: number;
  name: string;
}
function initQualitie(value: [string, number]): qualitieInterface {
  const qualitie = reactive({} as qualitieInterface);
  qualitie.id = value[0];
  qualitie.level = value[1];
  qualitie.name = qualitie.id;
  void getBaseJsonItem('tool_quality', qualitie.id).then((jsonItem) => {
    if (jsonItem) {
      qualitie.name = getName(jsonItem);
    }
  });
  return qualitie;
}

export interface QualitiesFeature {
  qualities: qualitieInterface[];
}
export function validate(jsonItem: JsonItem): boolean {
  return (
    (<QualitiesContent>jsonItem.content).qualities != undefined &&
    isItem(jsonItem.type)
  );
}
export function initQualitiesFeature(jsonItem: JsonItem): QualitiesFeature {
  const qualitiesFeature = reactive({} as QualitiesFeature);
  const qualitiesContent = jsonItem.content as QualitiesContent;
  qualitiesFeature.qualities = [];
  if (qualitiesContent.qualities) {
    qualitiesContent.qualities.forEach((qualitie) => {
      qualitiesFeature.qualities.push(initQualitie(qualitie));
    });
  }
  return qualitiesFeature;
}
