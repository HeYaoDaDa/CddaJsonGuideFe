<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <field-render-card :myField="field" :myStyle="undefined" />
  </q-card>
</template>

<script lang="ts">
import { ref } from 'vue';
import { RecipeFeature } from 'src/features/type/other/Recipe';
import FieldRenderCard from './field/FieldRenderCard.vue';
import { Field } from 'src/type';
export default {
  components: { FieldRenderCard },
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
const recipeFeature = ref(undefined as RecipeFeature | undefined);
const field = ref(undefined as Field | undefined);
if (isShow) {
  recipeFeature.value = new RecipeFeature(props.jsonItem);
  field.value = recipeFeature.value.toField();
}
</script>
