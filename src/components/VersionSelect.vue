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
import { initVersionOptions, showAjaxFailNotify } from '../api';
import { Cookies } from 'quasar';

const options = ref([] as Version[]);
const $store = useStore();
const config = $store.state.userConfig;

const selectedGameVersion = computed({
  get: () => config.version,
  set: (val) => {
    $store.commit('userConfig/selectVersion', val);
  },
});
initVersionOptions()
  .then((newVersions) => {
    options.value = newVersions;
    const cookieVersion = Cookies.get('version');
    if (cookieVersion && !selectedGameVersion.value.id) {
      const temp = options.value.find(
        (version) => version.id === cookieVersion
      );
      if (temp) {
        selectedGameVersion.value = temp;
      }
    } else if (!cookieVersion && newVersions.length > 0) {
      selectedGameVersion.value = newVersions[0];
    }
  })
  .catch(() => showAjaxFailNotify());
</script>
