<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <field-render-card
      :myField="recipeFeature.toField()"
      :myStyle="undefined"
    />
  </q-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { RecipeFeature } from 'src/features/type/other/Recipe';
import FieldRenderCard from './field/FieldRenderCard.vue';
export default {
  name: 'RecipeCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = props.jsonItem.type === 'recipe';
let recipeFeature: RecipeFeature;
if (isShow) {
  recipeFeature = reactive(new RecipeFeature(props.jsonItem));
  recipeFeature.asyncInit();
}
</script>
