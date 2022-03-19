<template>
  <q-page v-if="show" class="row justify-around content-start">
    <all-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
    <flags-card :jsonItem="jsonItem" />
    <attack-card :jsonItem="jsonItem" />
    <armor-card :jsonItem="jsonItem" />
    <json-card :jsonItem="jsonItem" />
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'JsonItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import AllCard from 'src/components/jsonItem/AllCard.vue';
import GeneralCard from 'src/components/jsonItem/GeneralCard.vue';
import FlagsCard from 'src/components/jsonItem/FlagsCard.vue';
import AttackCard from 'src/components/jsonItem/AttackCard.vue';
import JsonCard from 'src/components/jsonItem/JsonCard.vue';
import ArmorCard from 'src/components/jsonItem/ArmorCard.vue';
import { showAjaxFailNotify } from 'src/utils';
import { getJsonItem } from 'src/api/jsonItem';
import { ref, watch, computed } from 'vue';
import { Loading } from 'quasar';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'src/store';

const $route = useRoute();
const jsonItem = ref({} as JsonItem);
const $store = useStore();
const config = $store.state.userConfig;
const show = ref(false);
Loading.show();

function updateJsonItems(jsonType: string, jsonId: string) {
  getJsonItem(jsonType, jsonId)
    .then((newJsonItem) => {
      jsonItem.value = newJsonItem;
      Loading.hide();
      show.value = true;
    })
    .catch(() => showAjaxFailNotify());
}

updateJsonItems(
  $route.params.jsonType as string,
  $route.params.jsonId as string
);

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    show.value = false;
    Loading.show();
    updateJsonItems(to.params.jsonType as string, to.params.jsonId as string);
  }
});

watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => {
    show.value = false;
    Loading.show();
    updateJsonItems(
      $route.params.jsonType as string,
      $route.params.jsonId as string
    );
  }
);
</script>
