import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { useStore } from 'src/store';
import { UserConfigInterface } from 'src/store/user-config/state';
import { Ref } from 'vue';

api.defaults.withCredentials = true;

export function initVersionOptions(options: Ref<Version[]>): void {
  api
    .get('http://localhost:8081/v0.1/versions')
    .then((response: AxiosResponse<Version[]>) => {
      options.value = response.data;
    })
    .catch(() => {
      showAjaxFailNotify();
    });
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

export function initJsonTypeGuide(): void {
  const store = useStore();
  const userConfig = store.state.userConfig;
  api
    .get('http://localhost:8081/v0.1/itemTypes', {
      params: {
        lang: userConfig.language.value,
        version: userConfig.version.id,
        mods: JSON.stringify(userConfig.mods.map((mod) => mod.id)),
      },
    })
    .then((response: AxiosResponse<TypeTreeNode>) => {
      store.commit('userConfig/updateJsonTypeTree', [response.data]);
    })
    .catch(() => {
      showAjaxFailNotify();
    });
}

export function updateJsonItem(
  oldJsonItem: Ref<JsonItem>,
  jsonType: string,
  jsonId: string,
  then: () => void
): void {
  api
    .get(`http://localhost:8081/v0.1/${jsonType}/${jsonId}`)
    .then((response: AxiosResponse<JsonItem>) => {
      oldJsonItem.value = response.data;
      then();
    })
    .catch(() => {
      showAjaxFailNotify();
    });
}

export function getModById(modId: string) {
  return api
    .get(`http://localhost:8081/v0.1/mod_info/${modId}`)
    .then((response: AxiosResponse<JsonItem>) => response.data);
}

export function getUserLanguageCode(): string {
  return navigator.language;
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
