<template>
  <my-card label="label.recipe" v-if="isShow">
    <my-field label="label.pskill">
      <my-text :content="recipeFeature.skillName" span />
      <my-text :content="`(${recipeFeature.difficulty ?? 0})`" span />
    </my-field>

    <my-field label="label.skills">
      <ul>
        <li v-for="skill in recipeFeature.skills" :key="skill.id">
          <my-text :content="skill.name" span />
          <my-text :content="`(${skill.level ?? 0})`" span />
        </li>
      </ul>
    </my-field>

    <my-field label="label.byproducts">
      <ul>
        <li v-for="byproduct in recipeFeature.byproducts" :key="byproduct.id">
          <my-text
            :content="byproduct.name"
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'item',
                jsonId: byproduct.id,
              },
            }"
            span
          />
          <my-text :content="` x ${byproduct.amount}`" span />
        </li>
      </ul>
    </my-field>

    <my-field label="label.time">
      <my-text :content="recipeFeature.time" />
    </my-field>

    <my-field label="label.batch_time" dl>
      <my-field label="label.time" v-if="recipeFeature.batchTime">
        <my-text :content="recipeFeature.batchTime.multiplier + '%'" />
      </my-field>

      <my-field label="label.amount" v-if="recipeFeature.batchTime">
        <my-text :content="recipeFeature.batchTime.amount" />
      </my-field>
    </my-field>

    <my-field label="label.proficiency">
      <ul>
        <li
          v-for="proficiency in recipeFeature.proficiencies"
          :key="proficiency.proficiency"
        >
          <my-text
            :content="proficiency.name"
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'proficiency',
                jsonId: proficiency.proficiency,
              },
            }"
            span
          />
          <my-text
            :content="`(${proficiency.time_multiplier} x time, ${proficiency.fail_multiplier} x fail)`"
            span
          />
        </li>
      </ul>
    </my-field>

    <my-field label="label.tools">
      <ul>
        <li v-for="qualitie in recipeFeature.qualities" :key="qualitie.id">
          <my-text
            :content="qualitie.name"
            :route="{
              name: 'feature',
              params: {
                feature: 'qualities',
                sub: qualitie.id,
              },
            }"
            span
          />
          <my-text
            :content="` (${qualitie.level}) x ${qualitie.amount ?? 1}`"
            span
          />
        </li>
      </ul>
    </my-field>

    <my-field label="label.components">
      <ul>
        <li
          v-for="(components, index) in recipeFeature.components"
          :key="index"
        >
          <template
            v-for="(component, index) in components"
            :key="component.id"
          >
            <my-text
              :content="component.name"
              :route="{
                name: 'jsonItem',
                params: {
                  jsonType: 'item',
                  jsonId: component.id,
                },
              }"
              span
            />
            <my-text :content="` x ${component.amount}`" span />
            <my-text v-if="index < components.length - 1" content=" OR " span />
          </template>
        </li>
      </ul>
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initRecipeFeature } from 'src/features/type/other/Recipe';
import MyCard from './myComponents/MyCard.vue';
import MyField from './myComponents/MyField.vue';
import MyText from './myComponents/MyText/MyText.vue';
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
let recipeFeature;
if (isShow) {
  recipeFeature = reactive(initRecipeFeature(props.jsonItem));
}
</script>
