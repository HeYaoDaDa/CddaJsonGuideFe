import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { UserConfigInterface } from 'src/store/user-config/state';

export function getVersionOptions() {
  return api
    .get('http://localhost:8081/v0.1/versions')
    .then((response: AxiosResponse<Version[]>) => response.data);
}

export function getModsOptions(userConfig: UserConfigInterface) {
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

export function getAllJsonItemByCon(jsonType: string, pipeline: object[]) {
  return api
    .get(`http://localhost:8081/v0.1/${jsonType}`, {
      params: {
        pipeline: JSON.stringify(pipeline),
      },
    })
    .then((response: AxiosResponse<JsonItem[]>) => {
      return response.data;
    });
}
