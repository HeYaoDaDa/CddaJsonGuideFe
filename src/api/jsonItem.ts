import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { SearchResultItem } from 'src/type';

export function getJsonItemsByItemType(
  itemType: string,
  pipeline?: object[],
  language?: string,
  version?: string,
  mods?: string[]
) {
  return api
    .get(`http://localhost:8081/v0.1/jsonItems/${itemType}`, {
      params: {
        pipeline: pipeline ? JSON.stringify(pipeline) : '',
        language,
        version,
        mods: mods ? JSON.stringify(mods) : '',
      },
    })
    .then((response: AxiosResponse<JsonItem[]>) => {
      return response.data;
    });
}

export function getJsonItemListByJsonId(
  itemType: string,
  jsonId: string,
  language?: string,
  version?: string,
  mods?: string[]
) {
  return api
    .get(`http://localhost:8081/v0.1/jsonItems/${itemType}/${jsonId}`, {
      params: { language, version, mods },
    })
    .then((response: AxiosResponse<JsonItem[]>) => response.data);
}

export function searchJsonItem(
  name: string,
  category: string,
  language?: string,
  version?: string,
  mods?: string[]
) {
  return api
    .get('http://localhost:8081/v0.1/jsonItems/search', {
      params: { name, category, language, version, mods },
    })
    .then((response: AxiosResponse<SearchResultItem[]>) => response.data);
}
