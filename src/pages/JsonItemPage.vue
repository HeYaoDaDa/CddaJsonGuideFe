<template>
  <h3 v-if="json != undefined && 'name' in json" class="text-light">
    {{ json.name }}
  </h3>
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
import { ref, computed } from 'vue';
import { useStore } from '../store/index';

const $store = useStore();
const jsonItem = ref({} as JsonItem);

updateJsonItem(jsonItem, $store.state.currentJsonItemQuery);
console.log(jsonItem.value.content);
const json = computed({
  get: () => jsonItem.value.content,
  set: (val) => {
    jsonItem.value.content = val;
  },
});
</script>
