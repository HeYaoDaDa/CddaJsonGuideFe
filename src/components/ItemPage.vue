<template>
  <card-renders />
</template>

<script lang="ts">
import { ItemBase } from 'src/new/armor/ItemBase';
export default {
  name: 'ItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const item = new ItemBase(props.jsonItem);
const cardRenders = () => {
  return item.getView();
};
</script>
