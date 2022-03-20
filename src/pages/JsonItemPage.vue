<template>
  <q-page v-if="show" class="row justify-around content-start">
    <all-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
    <flags-card :jsonItem="jsonItem" />
    <attack-card :jsonItem="jsonItem" />
    <armor-card :jsonItem="jsonItem" />
    <card-renders />
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
import { getJsonItem } from 'src/api/jsonItem';
import { ref, watch, computed, VNode, h } from 'vue';
import { Loading } from 'quasar';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'src/store';
import { ReproductionCardClass } from 'src/cards/monsters/ReproductionCard';
import { CardInterface } from 'src/cards/CardInterface';

const $route = useRoute();
const jsonItem = ref({} as JsonItem);
const $store = useStore();
const config = $store.state.userConfig;
const show = ref(false);
const rendings = new Array<VNode>();
const cards: CardInterface[] = [new ReproductionCardClass()];

function updateJsonItem(jsonType: string, jsonId: string) {
  console.debug('updateJsonItem start');
  show.value = false;
  Loading.show();
  rendings.length = 0;
  void getJsonItem(jsonType, jsonId).then((newJsonItem) => {
    console.debug('updateJsonItem jsonItem is ', newJsonItem);
    jsonItem.value = newJsonItem;
    cards.forEach((card) => {
      const cardItem = new ReproductionCardClass().init(newJsonItem);
      if (cardItem) {
        rendings.push(cardItem.rending());
      }
    });
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
    get: () => [config.language, config.version],
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

const cardRenders = () => {
  return h('div', rendings);
};
</script>
