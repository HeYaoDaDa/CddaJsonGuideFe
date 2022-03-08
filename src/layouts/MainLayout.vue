<template>
  <q-layout view="hHr lpR fFf">
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

        <q-toolbar-title>
          {{ this.$t('label.cddaJsonGuide') }}
        </q-toolbar-title>

        <div>{{ config.version.label }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay bordered show-if-above>
      <q-list>
        <language-select />
        <version-select />
        <mods-select />
      </q-list>
    </q-drawer>

    <q-drawer show-if-above side="right" bordered>
      <!-- drawer content -->
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
import { useStore } from '../store/index';

import { defineComponent, ref } from 'vue';
const selectedGameVersion = ref('');
export default defineComponent({
  name: 'MainLayout',

  // provide: { selectedGameVersion: '', selectedMods: ['dda'] },
  provide() {
    return {
      selectedGameVersion: selectedGameVersion,
      selectedMods: ref(['dda']),
    };
  },
  components: {
    LanguageSelect,
    VersionSelect,
    ModsSelect,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $store = useStore();

    return {
      config: $store.state.config.config,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      selectedGameVersion,
    };
  },
});
</script>
