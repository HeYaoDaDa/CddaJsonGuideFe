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
import JsonTypeGuide from 'components/JsonTypeGuide.vue';
import LanguageSelect from 'components/LanguageSelect.vue';
import ModsSelect from 'components/ModsSelect.vue';
import VersionSelect from 'components/VersionSelect.vue';
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getUserLanguageCode, initJsonTypeGuide } from '../api';
import { languageOptions } from '../constant';
import { useStore } from '../store/index';
import SearchInput from 'components/SearchInput.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    LanguageSelect,
    VersionSelect,
    ModsSelect,
    JsonTypeGuide,
    SearchInput,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $store = useStore();
    const config = $store.state.userConfig;
    const { locale } = useI18n();
    const $router = useRouter();

    locale.value = getUserLanguageCode();

    $store.commit(
      'userConfig/selectLanguage',
      languageOptions.find((lang) => lang.value == config.language.value)
    );

    const jsonTypeTree = computed({
      get: () => config.jsonTypeTree,
      set: (val) => {
        $store.commit('userConfig/updateJsonTypeTree', val);
      },
    });

    initJsonTypeGuide();

    function goHome() {
      void $router.push({ path: '/' });
    }

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
