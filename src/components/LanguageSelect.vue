<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    emit-value
    map-options
    options-dense
  >
    <template v-slot:prepend> <q-icon name="language" /> </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Quasar } from 'quasar';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'LanguageSelect',
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    return {
      locale,
      localeOptions: [
        { value: 'en', label: 'English' },
        // { value: 'ar', label: 'العربية' },
        // { value: 'cs', label: 'Český Jazyk' },
        // { value: 'da', label: 'Dansk' },
        // { value: 'de', label: 'Deutsch' },
        // { value: 'el', label: 'Ελληνικά' },
        // { value: 'es_AR', label: 'Español (Argentina)' },
        // { value: 'es_ES', label: 'Español (España)' },
        // { value: 'fr', label: 'Français' },
        // { value: 'hu', label: 'Magyar' },
        // { value: 'id', label: 'Bahasa Indonesia' },
        // { value: 'is', label: 'Íslenska' },
        // { value: 'it_IT', label: 'Italiano' },
        // { value: 'ja', label: '日本語' },
        // { value: 'ko', label: '한국어' },
        // { value: 'nb', label: 'Norsk' },
        // { value: 'nl', label: 'Nederlands' },
        // { value: 'pl', label: 'Polski' },
        // { value: 'pt_BR', label: 'Português (Brasil)' },
        // { value: 'ru', label: 'Русский' },
        // { value: 'sr', label: 'Српски' },
        // { value: 'tr', label: 'Türkçe' },
        // { value: 'uk_UA', label: 'український' },
        { value: 'zh_CN', label: '中文 (天朝)' },
        // { value: 'zh_TW', label: '中文 (台灣)' },
      ],
    };
  },
  watch: {
    locale(newLocale: string) {
      newLocale = newLocale.replace('_', '-');
      if (newLocale == 'en') {
        newLocale = 'en-US';
      }
      void import('quasar/lang/' + newLocale).then(
        (lang: typeof import('quasar/lang/*')) => {
          Quasar.lang.set(lang.default);
        }
      );
    },
  },
});
</script>
