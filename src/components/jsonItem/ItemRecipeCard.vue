<template>
  <recipe-card
    v-for="recipe in recipes"
    :key="recipe.jsonId"
    :jsonItem="recipe"
  />
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { isItem } from 'src/utils/JsonItemUtil';
import { getJsonItemListByJsonId } from 'src/api';
import RecipeCard from '../RecipeCard.vue';
export default {
  components: { RecipeCard },
  name: 'ItemRecipeCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const recipes: JsonItem[] = reactive([]);
const isShow = ref(isItem(props.jsonItem.type) && recipes.length > 0);
if (isItem(props.jsonItem.type)) {
  void getJsonItemListByJsonId('recipe', props.jsonItem.jsonId).then(
    (jsonItems) => {
      console.warn(jsonItems);
      recipes.splice(0, recipes.length);
      recipes.push(...jsonItems);
      isShow.value = recipes.length > 0;
    }
  );
}
</script>
