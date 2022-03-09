import { api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { Notify } from 'quasar';
import { Ref } from 'vue';

interface version {
  _id: string;
  releaseName: string;
}

interface mod {
  jsonId: string;
  content: { name: string };
}

api.defaults.withCredentials = true;

export function initVersionOptions(options: Ref<SelectOption[]>): void {
  api
    .get('http://localhost:8081/v0.1/versions')
    .then((response: AxiosResponse<version[]>) => {
      options.value = response.data.map((version) => ({
        label: version.releaseName,
        value: version._id,
      }));
    })
    .catch(() => {
      showAjaxFailNotify();
    });
}

export function initModsOptions(
  options: Ref<SelectOption[]>,
  lang: string,
  version: string
): void {
  api
    .get('http://localhost:8081/v0.1/mod_info', {
      params: { mods: 'all', lang: lang, version: version },
    })
    .then((response: AxiosResponse<mod[]>) => {
      options.value = response.data.map((mod) => ({
        label: mod.content.name,
        value: mod.jsonId,
      }));
    })
    .catch(() => {
      showAjaxFailNotify();
    });
}

export function initJsonTypeGuide(
  rootTypeTreeNode: Ref<TypeTreeNode[]>,
  lang: string,
  version: string,
  mods: string[]
): void {
  api
    .get('http://localhost:8081/v0.1/itemTypes', {
      params: { mods: mods, lang: lang, version: version },
    })
    .then((response: AxiosResponse<TypeTreeNode>) => {
      rootTypeTreeNode.value = [response.data];
    })
    .catch(() => {
      showAjaxFailNotify();
    });
}

export function getUserLanguageCode(): string {
  return navigator.language;
}

function showAjaxFailNotify() {
  Notify.create({
    color: 'negative',
    position: 'top',
    message: 'Loading failed',
    icon: 'report_problem',
  });
}
