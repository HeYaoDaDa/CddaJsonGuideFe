import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { UserConfigInterface } from 'src/store/user-config/state';

api.defaults.withCredentials = true;

export function initVersionOptions() {
  return api
    .get('http://localhost:8081/v0.1/versions')
    .then((response: AxiosResponse<Version[]>) => response.data);
}

export function initModsOptions(userConfig: UserConfigInterface) {
  return api
    .get('http://localhost:8081/v0.1/mod_info', {
      params: {
        mods: '["all"]',
        lang: userConfig.language.value,
        version: userConfig.version.id,
      },
    })
    .then((response: AxiosResponse<JsonItem[]>) => {
      return response.data.map((mod) => {
        const modJson = mod.content as {
          name: string;
          description: string;
          category: string;
        };
        return {
          id: mod.jsonId,
          name: modJson.name,
          description: modJson.description,
          category: modJson.category,
        };
      });
    });
}

export function getJsonTypeTree(userConfig: UserConfigInterface) {
  return api
    .get('http://localhost:8081/v0.1/itemTypes', {
      params: {
        lang: userConfig.language.value,
        version: userConfig.version.id,
        mods: JSON.stringify(userConfig.mods.map((mod) => mod.id)),
      },
    })
    .then((response: AxiosResponse<TypeTreeNode>) => {
      return response.data;
    });
}

export function getJsonItems(
  jsonType: string,
  jsonId: string,
  isOriginal = false
) {
  return api
    .get(`http://localhost:8081/v0.1/${jsonType}/${jsonId}`, {
      params: { isOriginal: isOriginal },
    })
    .then((response: AxiosResponse<JsonItem[]>) => response.data);
}

export function getModById(modId: string) {
  return api
    .get(`http://localhost:8081/v0.1/mod_info/${modId}`)
    .then((response: AxiosResponse<JsonItem>) => response.data);
}

export function getUserLanguageCode(): string {
  return navigator.language;
}

export function searchItem(content: string, category: string) {
  return api
    .get('http://localhost:8081/v0.1/search', {
      params: { content: content, category: category },
    })
    .then((response: AxiosResponse<SearchResultItem[]>) => response.data);
}

export function getHaveAndValue<T extends object, K extends keyof T>({
  obj,
  key,
  def,
}: {
  obj: T;
  key: K;
  def: T[K];
}) {
  const have = obj[key] != undefined;
  let value = def;
  if (have) {
    value = obj[key];
  }
  return { have, value };
}

export function showAjaxFailNotify() {
  Notify.create({
    color: 'negative',
    position: 'top',
    message: 'Loading failed',
    icon: 'report_problem',
  });
}
