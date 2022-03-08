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
import { ref, computed } from 'vue';
import { useStore } from '../store/index';
import { initModsOptions } from '../api';

const $store = useStore();
const config = $store.state.config.config;
const options = ref([]);

const selectedMods = computed({
  get: () => config.mods,
  set: (val) => {
    $store.commit('config/selectMods', val);
  },
});

function filterFn(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (options.value.length == 0) {
      initModsOptions(options, config.language.value, config.version.value);
    }
  });
}
</script>
