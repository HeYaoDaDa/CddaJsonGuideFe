import { reactive } from 'vue';

interface RecipeCategoryContent {
  recipe_subcategories: { id: string; name: string }[];
}

interface RecipeCategoryFeature {
  recipeSubcategories: { id: string; name: string }[];
}
export function initRecipeCategoryFeature(
  jsonItem: JsonItem
): RecipeCategoryFeature {
  const feature = reactive({} as RecipeCategoryFeature);
  const content = jsonItem.content as RecipeCategoryContent;
  feature.recipeSubcategories = content.recipe_subcategories;
  return feature;
}

export function validate(jsonItem: JsonItem): boolean {
  return 'recipe_category' === jsonItem.type;
}
