<template>
  <template v-if="jsonItem">
    <name-card :jsonItem="jsonItem" />
    <material-card :jsonItem="jsonItem" />
    <armor-card :jsonItem="jsonItem" />
    <recipe-card :jsonItem="jsonItem" />
    <uncraft-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
    <flags-card :jsonItem="jsonItem" />
    <item-melee-attack-card :jsonItem="jsonItem" />
    <qualities-card :jsonItem="jsonItem" />
    <card-renders />
    <item-recipe-card :jsonItem="jsonItem" />
    <item-uncraft-card :jsonItem="jsonItem" />
    <monster-special-attack-card :jsonItem="jsonItem" />
    <spell-card :jsonItem="jsonItem" />
    <gun-card :jsonItem="jsonItem" />
    <monster-attack-card :jsonItem="jsonItem" />
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
import RecipeCard from './RecipeCard.vue';
import ItemRecipeCard from './jsonItem/ItemRecipeCard.vue';
import MaterialCard from './jsonItem/MaterialCard.vue';
import ArmorCard from './jsonItem/ArmorCard.vue';
import { featureFactorys } from 'src/features';
import { ref, VNode, h } from 'vue';
import CardComponent from 'src/components/jsonItem/CardComponent.vue';
import ItemMeleeAttackCard from './jsonItem/ItemMeleeAttackCard.vue';
import UncraftCard from './UncraftCard.vue';
import ItemUncraftCard from './jsonItem/ItemUncraftCard.vue';
import SpellCard from './SpellCard.vue';
import MonsterSpecialAttackCard from './jsonItem/MonsterSpecialAttackCard.vue';
import GunCard from './jsonItem/GunCard.vue';
import MonsterAttackCard from './jsonItem/MonsterAttackCard.vue';

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
  if (rendings.length > 0)
    return h('div', { class: 'q-card col q-my-sm q-mx-xs' }, rendings);
};
</script>
