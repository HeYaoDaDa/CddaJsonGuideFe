<template>
  <q-select
    filled
    v-model="selectedGameVersion"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :label="$t('lable.gameVersion')"
    :options="options"
    @filter="filterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { api } from 'boot/axios';
import { inject, ref } from 'vue';
import { QSelect, useQuasar } from 'quasar';
import { AxiosResponse } from 'axios';
const selectedGameVersion = inject('selectedGameVersion');
const options = ref([{ label: 'test', value: 'test' }]);
function filterFn(
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
) {
  // if(this.options.length > 0){
  //   return
  // }
  update(() => {
    api
      .get('http://localhost:8081/v0.1/versions')
      .then(
        (response: AxiosResponse<{ _id: string; releaseName: string }[]>) => {
          options.value = response.data.map((version) => ({
            label: version.releaseName,
            value: version._id,
          }));
        }
      )
      .catch(() => {
        useQuasar().notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem',
        });
      });
  });
}
</script>
