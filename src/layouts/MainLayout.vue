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

        <div>{{ config.version.label }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-list>
        <language-select />
        <version-select />
        <mods-select />
      </q-list>
    </q-drawer>

    <q-drawer show-if-above side="right" bordered>
      <json-type-guide :datas="jsonTypeTree" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import LanguageSelect from 'components/LanguageSelect.vue';
import VersionSelect from 'components/VersionSelect.vue';
import ModsSelect from 'components/ModsSelect.vue';
import JsonTypeGuide from 'components/JsonTypeGuide.vue';
import { useStore } from '../store/index';
import { defineComponent, ref, computed } from 'vue';
import { initJsonTypeGuide, getUserLanguageCode } from '../api';
import { useI18n } from 'vue-i18n';
import { localeOptions } from '../constant';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  components: {
    LanguageSelect,
    VersionSelect,
    ModsSelect,
    JsonTypeGuide,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $store = useStore();
    const config = $store.state.config.config;
    const { locale } = useI18n();
    const $router = useRouter();

    locale.value = getUserLanguageCode();

    $store.commit(
      'config/selectLanguage',
      localeOptions.find((lang) => lang.value == locale.value)
    );

    const jsonTypeTree = computed({
      get: () => config.jsonTypeTree,
      set: (val) => {
        $store.commit('config/updateJsonTypeTree', val);
      },
    });

    function goHome() {
      void $router.push({ path: '/' });
    }

    initJsonTypeGuide(
      jsonTypeTree,
      config.language.value,
      config.version.value,
      config.mods
    );

    return {
      config,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      jsonTypeTree,
      goHome,
    };
  },
});
</script>
