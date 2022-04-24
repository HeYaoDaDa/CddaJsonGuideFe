<template>
  <card-renders v-if="isShow" />
</template>

<script lang="ts">
import { computed, h } from 'vue';
import { changeOnlyReadlyComputed } from 'src/constant/LogConstant';
import { Material } from 'src/new/material/Material';
import MyCard from '../myComponents/MyCard.vue';
export default {
  name: 'MaterialCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();

const isShow = computed({
  get: () => new Material(undefined).validateValue(props.jsonItem),
  set: () => {
    console.error(changeOnlyReadlyComputed);
  },
});

let material: Material;
if (isShow.value) {
  material = new Material(props.jsonItem);
}

const cardRenders = () => {
  if (isShow.value) {
    return h(MyCard, { label: 'material' }, () => material.getView());
  }
};
</script>
