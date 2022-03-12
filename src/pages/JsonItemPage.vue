<template>
  <q-page v-if="show" class="row justify-around content-start">
    <all-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
    <flags-card :jsonItem="jsonItem" />
    <attack-card :jsonItem="jsonItem" />
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
import { getJsonItem, showAjaxFailNotify } from 'src/api';
import { ref, watch, computed } from 'vue';
import AllCard from 'src/components/jsonItem/AllCard.vue';
import { Loading } from 'quasar';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import GeneralCard from 'src/components/jsonItem/GeneralCard.vue';
import FlagsCard from 'src/components/jsonItem/FlagsCard.vue';
import AttackCard from 'src/components/jsonItem/AttackCard.vue';
import JsonCard from 'src/components/jsonItem/JsonCard.vue';
import { useStore } from 'src/store';

const $route = useRoute();
const jsonItem = ref({} as JsonItem);
const $store = useStore();
const config = $store.state.userConfig;
const show = ref(false);
Loading.show();

function updateJsonItem() {
  getJsonItem($route.params.jsonType as string, $route.params.jsonId as string)
    .then((newJsonItem) => {
      jsonItem.value = newJsonItem;
      Loading.hide();
      show.value = true;
    })
    .catch(() => showAjaxFailNotify());
}

updateJsonItem();

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    show.value = false;
    Loading.show();
    getJsonItem(to.params.jsonType as string, to.params.jsonId as string)
      .then((newJsonItem) => {
        jsonItem.value = newJsonItem;
        Loading.hide();
        show.value = true;
      })
      .catch(() => showAjaxFailNotify());
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
    updateJsonItem();
  }
);
</script>
