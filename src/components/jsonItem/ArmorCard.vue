<template>
  <card-renders v-if="isShow" />
</template>

<script lang="ts">
import { computed, h } from 'vue';
import { changeOnlyReadlyComputed } from 'src/constant/LogConstant';
import MyCard from '../myComponents/MyCard.vue';
import { Armor } from 'src/new/armor/Armor';
import { ItemBase } from 'src/new/armor/ItemBase';
export default {
  name: 'ArmorCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();

const isShow = computed({
  get: () => new Armor(undefined).validateValue(props.jsonItem),
  set: () => {
    console.error(changeOnlyReadlyComputed);
  },
});

let armor: Armor;
if (isShow.value) {
  armor = new Armor(props.jsonItem);
  const item = new ItemBase(props.jsonItem);
  armor.load(item);
  console.log('armor', armor);
}

const cardRenders = () => {
  if (isShow.value) {
    return h(MyCard, { label: 'armor', width: '50%' }, () => armor.getView());
  }
};
</script>
