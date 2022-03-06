<template>
  <q-select
    filled
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
import { localeOptions } from '../constant';
export default defineComponent({
  name: 'LanguageSelect',
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    return {
      locale,
      localeOptions,
    };
  },
  watch: {
    locale(newLocale: string) {
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
