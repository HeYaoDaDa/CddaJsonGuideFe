<template>
  <q-select
    filled
    v-model="selectedGameVersion"
    :options="options"
    option-label="tagName"
    :label="$t('label.gameVersion')"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :key="key"
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
import { useStore } from 'src/store/index';
import { getVersions } from 'src/api';

const options = ref([] as Version[]);
const $store = useStore();
const key = ref(0);

const selectedGameVersion = computed({
  get: () => $store.state.userConfig.version,
  set: (val) => {
    $store.commit('userConfig/selectVersion', val);
  },
});

console.debug('component VersionSelect init start');
void getVersions().then((newVersions) => {
  options.value = newVersions;
  $store.commit('userConfig/updateVersionsInfo', newVersions);
  //FIXME Refresh select label
  key.value++;
});
</script>
