<template>
  <q-badge>{{ selectedGameVersion }}</q-badge>
  <q-badge>{{ options }}</q-badge>
  <q-select
    filled
    v-model="selectedGameVersion"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :label="$t('label.gameVersion')"
    :options="options"
    option-label="tagName"
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
export default {
  name: 'VersionSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '../store/index';
import { initVersionOptions } from '../api';

const options = ref([]);
const $store = useStore();
const config = $store.state.userConfig;

const selectedGameVersion = computed({
  get: () => config.version,
  set: (val) => {
    $store.commit('userConfig/selectVersion', val);
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
