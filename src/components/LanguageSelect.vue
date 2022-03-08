<template>
  <q-select
    filled
    v-model="selectedLanguage"
    :options="localeOptions"
    options-dense
  >
    <template v-slot:prepend> <q-icon name="language" /> </template>
  </q-select>
</template>

<script lang="ts">
export default {
  name: 'LanguageSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { watch, computed } from 'vue';
import { Quasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store/index';
import { localeOptions } from '../constant';
import { initModsOptions, initJsonTypeGuide } from '../api';

const { locale } = useI18n({ useScope: 'global' });
const $store = useStore();
const config = $store.state.config.config;

const selectedLanguage = computed({
  get: () => config.language,
  set: (val) => {
    $store.commit('config/selectLanguage', val);
  },
});

function updateModOptionsLanguage() {
  if (config.modSelectOptions.length > 0) {
    const modSelectOptions = computed({
      get: () => config.modSelectOptions,
      set: (val) => {
        $store.commit('config/updateModOptions', val);
      },
    });
    initModsOptions(
      modSelectOptions,
      config.language.value,
      config.version.value
    );
  }
}

const jsonTypeTree = computed({
  get: () => config.jsonTypeTree,
  set: (val) => {
    $store.commit('config/updateJsonTypeTree', val);
  },
});

watch(selectedLanguage, (newLanguage) => {
  const newLocale = newLanguage.value;
  locale.value = newLocale;
  void import('quasar/lang/' + newLocale).then(
    (lang: typeof import('quasar/lang/*')) => {
      Quasar.lang.set(lang.default);
    }
  );
  updateModOptionsLanguage();
  initJsonTypeGuide(
    jsonTypeTree,
    config.language.value,
    config.version.value,
    config.mods
  );
});
</script>
