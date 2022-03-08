<template>
  <q-select
    filled
    v-model="selectedMods"
    :options="options"
    :label="$t('label.mods')"
    multiple
    emit-value
    map-options
    @filter="filterFn"
  >
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label v-html="opt.label"></q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :modelValue="selected"
            @update:modelValue="toggleOption(opt)"
          />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { AxiosResponse } from 'axios';

let selectedMods = inject('selectedMods');
const options = ref([{ label: 'test', value: 'test' }]);

function filterFn(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    api
      .get('http://localhost:8081/v0.1/mod_info', { params: { mods: 'all' } })
      .then(
        (
          response: AxiosResponse<
            { jsonId: string; content: { name: string } }[]
          >
        ) => {
          console.log(response.data);
          options.value = response.data.map((mod) => ({
            label: mod.content.name,
            value: mod.jsonId,
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
