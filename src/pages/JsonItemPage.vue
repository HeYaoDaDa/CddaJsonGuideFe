<template>
  <all-card :jsonItem="jsonItem" />
</template>

<script lang="ts">
export default {
  name: 'JsonItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { updateJsonItem } from 'src/api';
import { ref } from 'vue';
import { useStore } from '../store/index';
import AllCard from 'src/components/jsonItem/AllCard.vue';

const $store = useStore();
const jsonItem = ref({} as JsonItem);

updateJsonItem(jsonItem, $store.state.currentJsonItemQuery);
console.log(jsonItem.value.content);
</script>
