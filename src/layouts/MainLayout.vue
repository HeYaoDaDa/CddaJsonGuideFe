<template>
  <q-layout view="hHr LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Settings"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title @click="goHome">
          {{ this.$t('label.cddaJsonGuide') }}
        </q-toolbar-title>

        <div><search-input /></div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered show-if-above>
      <q-list>
        <language-select />
        <version-select />
        <mods-select />
      </q-list>
    </q-drawer>

    <q-drawer side="right" bordered show-if-above>
      <json-type-tree />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import LanguageSelect from 'src/components/leftDrawer/LanguageSelect.vue';
import ModsSelect from 'src/components/leftDrawer/ModsSelect.vue';
import VersionSelect from 'src/components/leftDrawer/VersionSelect.vue';
import JsonTypeTree from 'components/JsonTypeTree.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getUserLanguageCode } from 'src/utils';
import { languageOptions } from '../constant';
import { useStore } from '../store/index';
import SearchInput from 'components/SearchInput.vue';

export default {
  name: 'MainLayout',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const leftDrawerOpen = ref(false);
const $router = useRouter();
function goHome() {
  void $router.push({ path: '/' });
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const $store = useStore();
const config = $store.state.userConfig;
function init() {
  console.debug('MainLayout init() start');
  const { locale } = useI18n();
  locale.value = getUserLanguageCode();
  $store.commit(
    'userConfig/selectLanguage',
    languageOptions.find((lang) => lang.value == config.language.value)
  );
}

watch(
  computed({
    get: () => [
      config.language.value,
      config.version.id,
      config.mods.map((mod) => mod.id),
    ],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => {
    console.debug('MainLayout user config is change');
    $store.commit('baseJsonItems/clearJsonItemMap');
  }
);

init();
</script>
