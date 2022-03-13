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
    behavior="dialog"
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
import { computed, ref, watch } from 'vue';
import { useStore } from '../store/index';
import { initModsOptions, showAjaxFailNotify } from '../api';

const $store = useStore();
const config = $store.state.userConfig;
const options = ref([] as Array<Mod>);

const selectedMods = computed({
  get: () => config.mods,
  set: (val) => {
    $store.commit('userConfig/selectMods', val);
  },
});

function filterFn(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (options.value.length == 0) {
      initModsOptions(config)
        .then((newOptions) => {
          options.value = newOptions;
        })
        .catch(() => showAjaxFailNotify());
    }
  });
}

watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => {
    if (options.value.length > 0) {
      initModsOptions(config)
        .then((newOptions) => {
          options.value = newOptions;
          if (config.mods.length > 0) {
            const newMods: Array<Mod> = [];
            config.mods.forEach((mod) => {
              const temp = options.value.find((option) => option.id == mod.id);
              if (temp != null) {
                newMods.push(temp);
              }
            });
            $store.commit('userConfig/selectMods', newMods);
          }
        })
        .catch(() => showAjaxFailNotify());
    }
  }
);
</script>
