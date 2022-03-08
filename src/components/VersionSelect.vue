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
import { ref, computed } from 'vue';
import { useStore } from '../store/index';
import { initVersionOptions } from '../api';

const options = ref([]);
const $store = useStore();

const selectedGameVersion = computed({
  get: () => $store.state.config.config.version,
  set: (val) => {
    $store.commit('config/selectVersion', val);
  },
});

function filterFn(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (options.value.length == 0) {
      initVersionOptions(options);
    }
  });
}
</script>
