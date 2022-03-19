<template>
  <q-select
    filled
    v-model="selectedMods"
    :options="options"
    option-label="name"
    :label="$t('label.mods')"
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
import { Cookies } from 'quasar';
import { showAjaxFailNotify } from 'src/utils';
import { getModsOptions } from 'src/api';

const $store = useStore();
const config = $store.state.userConfig;
const options = ref([] as Array<Mod>);

const selectedMods = computed({
  get: () => config.mods,
  set: (val) => {
    $store.commit('userConfig/selectMods', val);
  },
});

getModsOptions(config)
  .then((newOptions) => {
    options.value = newOptions;
    const modIds: string[] = Cookies.get('mods');
    if (modIds && modIds.length > 0 && selectedMods.value.length == 0) {
      const newSelectMods: Array<Mod> = [];
      modIds.forEach((modId) => {
        const newSelectMod = newOptions.find((option) => modId === option.id);
        if (newSelectMod) {
          newSelectMods.push(newSelectMod);
        }
      });
      selectedMods.value = newSelectMods;
    } else if (!(modIds && modIds.length > 0) && options.value.length > 0) {
      selectedMods.value = [
        options.value.find((mod) => mod.id === 'dda') as Mod,
      ];
    }
  })
  .catch(() => showAjaxFailNotify());

watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => {
    if (options.value.length > 0) {
      getModsOptions(config)
        .then((newOptions) => {
          options.value = newOptions;
          if (config.mods.length > 0) {
            const newMods: Array<Mod> = [];
            selectedMods.value.forEach((mod) => {
              const temp = options.value.find((option) => option.id == mod.id);
              if (temp != null) {
                newMods.push(temp);
              }
            });
            selectedMods.value = newMods;
          }
        })
        .catch(() => showAjaxFailNotify());
    }
  }
);
</script>
