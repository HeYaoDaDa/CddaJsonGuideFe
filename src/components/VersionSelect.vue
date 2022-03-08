<template>
  <q-select
    filled
    v-model="selectedGameVersion"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :label="$t('label.gameVersion')"
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
import { ref, computed } from 'vue';
import { QSelect, useQuasar } from 'quasar';
import { AxiosResponse } from 'axios';
import { useStore } from '../store/index';

const options = ref([{ label: 'Latest', value: 'latest' }]);
const $store = useStore();

const selectedGameVersion = computed({
  get: () => $store.state.config.config.version,
  set: (val) => {
    $store.commit('config/selectVersion', val);
  },
});

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
