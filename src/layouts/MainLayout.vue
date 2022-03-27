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
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getUserLanguageCode } from 'src/utils';
import { languageOptions } from '../constant';
import { useStore } from '../store/index';
import SearchInput from 'components/SearchInput.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    LanguageSelect,
    VersionSelect,
    ModsSelect,
    SearchInput,
    JsonTypeTree,
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

    function goHome() {
      void $router.push({ path: '/' });
    }

    return {
      config,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goHome,
    };
  },
});
</script>
