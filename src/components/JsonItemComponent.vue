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
import { cardTypes } from 'src/constant';
import CardComponent from 'src/components/jsonItem/CardComponent.vue';

const props = defineProps<{
  jsonItem: JsonItem;
}>();
const jsonItem = ref(props.jsonItem);
const rendings = new Array<VNode>();

cardTypes.forEach((card, key) => {
  const cardItem = card.initCardByJsonItem(jsonItem.value);
  if (cardItem) {
    rendings.push(
      h(CardComponent, {
        jsonItem: jsonItem.value,
        columns: cardItem.getColumns(),
        label: cardItem.label,
        cardKey: key,
      })
    );
  }
});

const cardRenders = () => {
  return h('div', rendings);
};
</script>
