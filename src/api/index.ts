import { api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { useQuasar } from 'quasar';
import { Ref } from 'vue';

interface version {
  _id: string;
  releaseName: string;
}

export function initVersionOptions(options: Ref<SelectOption[]>) {
  api
    .get('http://localhost:8081/v0.1/versions')
    .then((response: AxiosResponse<version[]>) => {
      options.value = response.data.map((version) => ({
        label: version.releaseName,
        value: version._id,
      }));
    })
    .catch(() => {
      useQuasar().notify({
        color: 'negative',
        position: 'top',
        message: 'Loading failed',
        icon: 'report_problem',
      });
    });
}
