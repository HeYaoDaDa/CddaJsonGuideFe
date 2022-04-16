<template>
  <q-page v-if="show" class="row justify-around content-start">
    <template v-for="jsonItem in jsonItems" :key="jsonItem._id">
      <json-item-component :jsonItem="jsonItem" />
    </template>
  </q-page>
</template>

<script lang="ts">
import JsonItemComponent from 'src/components/JsonItemComponent.vue';
import { getJsonItemListByJsonId } from 'src/api/jsonItem';
import { ref, watch, computed } from 'vue';
import { Loading } from 'quasar';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'src/store';
export default {
  name: 'JsonItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const $route = useRoute();
const jsonItems = ref(new Array<JsonItem>());
const $store = useStore();
const config = $store.state.userConfig;
const show = ref(false);

function updateJsonItem(jsonType: string, jsonId: string) {
  console.debug('updateJsonItem start');
  show.value = false;
  Loading.show();
  void getJsonItemListByJsonId(jsonType, jsonId).then((newJsonItems) => {
    console.debug('updateJsonItem jsonItem is ', newJsonItems);
    jsonItems.value = newJsonItems;
    Loading.hide();
    show.value = true;
  });
}

console.debug('JsonItemPage init');
updateJsonItem(
  $route.params.jsonType as string,
  $route.params.jsonId as string
);

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    console.debug('JsonItemPage route update');
    updateJsonItem(to.params.jsonType as string, to.params.jsonId as string);
  }
});

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
    console.debug('JsonItemPage config update');
    updateJsonItem(
      $route.params.jsonType as string,
      $route.params.jsonId as string
    );
  }
);
</script>
