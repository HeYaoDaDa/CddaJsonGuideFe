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

<script setup lang="ts">
import { watch, computed } from 'vue';
import { Quasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store/index';
import { localeOptions } from '../constant';
import { initModsOptions } from '../api';

const { locale } = useI18n({ useScope: 'global' });
const $store = useStore();
const config = $store.state.config.config;

$store.commit(
  'config/selectLanguage',
  localeOptions.find((lang) => lang.value == locale.value)
);

const selectedLanguage = computed({
  get: () => config.language,
  set: (val) => {
    $store.commit('config/selectLanguage', val);
  },
});

function updateModOptionsLanguage() {
  console.log('updateModOptionsLanguage');
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

watch(selectedLanguage, (newLanguage) => {
  const newLocale = newLanguage.value;
  locale.value = newLocale;
  void import('quasar/lang/' + newLocale).then(
    (lang: typeof import('quasar/lang/*')) => {
      Quasar.lang.set(lang.default);
    }
  );
  updateModOptionsLanguage();
});
</script>
