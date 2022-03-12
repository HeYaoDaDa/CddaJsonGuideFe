<template>
  <q-select
    filled
    v-model="selectedLanguage"
    :options="languageOptions"
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
import { languageOptions } from '../constant';

const { locale } = useI18n({ useScope: 'global' });
const $store = useStore();
const config = $store.state.userConfig;

locale.value = config.language.value;
void import('quasar/lang/' + config.language.value).then(
  (lang: typeof import('quasar/lang/*')) => {
    Quasar.lang.set(lang.default);
  }
);

const selectedLanguage = computed({
  get: () => config.language,
  set: (val) => {
    $store.commit('userConfig/selectLanguage', val);
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
