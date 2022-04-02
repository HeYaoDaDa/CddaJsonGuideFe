<template>
  <template v-if="jsonItem">
    <name-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
    <flags-card :jsonItem="jsonItem" />
    <qualities-card :jsonItem="jsonItem" />
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
import NameCard from 'src/components/jsonItem/NameCard.vue';
import GeneralCard from 'src/components/jsonItem/GeneralCard.vue';
import FlagsCard from 'src/components/jsonItem/FlagsCard.vue';
import JsonCard from 'src/components/jsonItem/JsonCard.vue';
import QualitiesCard from 'src/components/jsonItem/QualitiesCard.vue';
import { featureFactorys } from 'src/features';
import { ref, VNode, h } from 'vue';
import CardComponent from 'src/components/jsonItem/CardComponent.vue';

const props = defineProps<{
  jsonItem: JsonItem;
}>();
const jsonItem = ref(props.jsonItem);
const rendings = new Array<VNode>();

featureFactorys.forEach((feature) => {
  const featureHandler = feature.getFeatureHandler();
  if (featureHandler.validate(jsonItem.value)) {
    rendings.push(
      h(CardComponent, {
        jsonItem: jsonItem.value,
        featureHandler,
        cardKey: featureHandler.featureKey,
      })
    );
  }
});

const cardRenders = () => {
  return h('div', { class: 'q-card col q-my-sm q-mx-xs' }, rendings);
};
</script>
