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

<script lang="ts">
export default {
  name: 'ModsSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../store/index';
import { initModsOptions } from '../api';

const $store = useStore();
const config = $store.state.config.config;

const selectedMods = computed({
  get: () => config.mods,
  set: (val) => {
    $store.commit('config/selectMods', val);
  },
});

const options = computed({
  get: () => config.modSelectOptions,
  set: (val) => {
    $store.commit('config/updateModOptions', val);
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
