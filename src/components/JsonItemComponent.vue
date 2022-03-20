<template>
  <template v-if="jsonItem">
    <all-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
    <flags-card :jsonItem="jsonItem" />
    <attack-card :jsonItem="jsonItem" />
    <armor-card :jsonItem="jsonItem" />
    <card-renders />
    <json-card :jsonItem="jsonItem" />
  </template>
</template>

<script lang="ts">
export default {
  name: 'JsonItemComponent',
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
import { ref, VNode, h } from 'vue';
import { ReproductionCardClass } from 'src/cards/monsters/ReproductionCard';
import { CardInterface } from 'src/cards/CardInterface';
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const jsonItem = ref(props.jsonItem);
const rendings = new Array<VNode>();
const cards: CardInterface[] = [new ReproductionCardClass()];

cards.forEach((card) => {
  const cardItem = card.init(jsonItem.value);
  if (cardItem) {
    rendings.push(cardItem.rending());
  }
});

const cardRenders = () => {
  return h('div', rendings);
};
</script>
