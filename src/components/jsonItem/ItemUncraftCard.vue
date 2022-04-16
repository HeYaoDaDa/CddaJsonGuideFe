<template>
  <uncraft-card
    v-for="uncraft in uncrafts"
    :key="uncraft.jsonId"
    :jsonItem="uncraft"
  />
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { isItem } from 'src/utils/JsonItemUtil';
import UncraftCard from '../UncraftCard.vue';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
export default {
  name: 'ItemRecipeCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const uncrafts: JsonItem[] = reactive([]);
const isShow = ref(isItem(props.jsonItem.type) && uncrafts.length > 0);
if (isItem(props.jsonItem.type)) {
  void getBaseJsonItem('uncraft', props.jsonItem.jsonId).then((jsonItems) => {
    uncrafts.splice(0, uncrafts.length);
    uncrafts.push(...jsonItems);
    isShow.value = uncrafts.length > 0;
  });
}
</script>
