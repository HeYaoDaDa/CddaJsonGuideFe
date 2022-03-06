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

<script setup lang="ts">
import { watch } from 'vue';
import { Quasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { localeOptions } from '../constant';
const { locale } = useI18n({ useScope: 'global' });
watch(locale, (newLocale: string) => {
  if (newLocale == 'en') {
    newLocale = 'en-US';
  }
  void import('quasar/lang/' + newLocale).then(
    (lang: typeof import('quasar/lang/*')) => {
      Quasar.lang.set(lang.default);
    }
  );
});
</script>
