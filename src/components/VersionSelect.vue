<template>
  <q-select
    filled
    v-model="selectedGameVersion.value"
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

<script lang="ts">
import { api } from 'boot/axios';
import { defineComponent } from 'vue';
import { QSelect, useQuasar } from 'quasar';
import { AxiosResponse } from 'axios';
export default defineComponent({
  name: 'VersionSelect',

  inject: ['selectedGameVersion'],

  data() {
    return {
      options: [{ label: 'test', value: 'test' }],
    };
  },

  methods: {
    filterFn(
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
            (
              response: AxiosResponse<{ _id: string; releaseName: string }[]>
            ) => {
              this.options = response.data.map((version) => ({
                label: version.releaseName,
                value: version._id,
              }));
              console.warn(this.options);
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
    },
  },
});
</script>
