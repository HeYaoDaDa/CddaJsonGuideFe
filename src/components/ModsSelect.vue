<template>
  <q-select
    filled
    v-model="selectedMods"
    :options="options"
    option-label="name"
    :label="$t('label.mods')"
    @filter="filterFn"
    multiple
    use-chips
    options-cover
  >
  </q-select>
</template>

<script lang="ts">
export default {
  name: 'ModsSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../store/index';
import { initModsOptions } from '../api';

const $store = useStore();
const config = $store.state.userConfig;
const options = ref([]);

const selectedMods = computed({
  get: () => config.mods,
  set: (val) => {
    $store.commit('userConfig/selectMods', val);
  },
});

function filterFn(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (options.value.length == 0) {
      initModsOptions(options, config.language.value, config.version.id);
    }
  });
}
</script>
