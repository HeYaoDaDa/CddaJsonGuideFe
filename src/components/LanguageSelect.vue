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

const { locale } = useI18n({ useScope: 'global' });
const $store = useStore();

$store.commit(
  'config/selectLanguage',
  localeOptions.find((lang) => lang.value == locale.value)
);

const selectedLanguage = computed({
  get: () => $store.state.config.config.language,
  set: (val) => {
    $store.commit('config/selectLanguage', val);
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
});
</script>
