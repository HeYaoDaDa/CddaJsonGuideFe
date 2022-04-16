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
import { useStore } from '../../store/index';
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
function initModsSelect() {
  console.debug('component ModsSelect init start');
  void getModsOptions().then((newOptions) => {
    options.value = newOptions;
    $store.commit('userConfig/updateModsInfo', newOptions);
  });
}

initModsSelect();
watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => {
    if (options.value.length > 0) {
      initModsSelect();
    }
  }
);
</script>
