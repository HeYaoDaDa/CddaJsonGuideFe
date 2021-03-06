<template>
  <my-card
    label="label.recipe"
    v-if="isShow"
    :route="{
      name: 'jsonItem',
      params: {
        jsonType: 'recipe',
        jsonId: recipeFeature.result,
      },
    }"
  >
    <my-text
      v-if="recipeFeature.obsolete"
      :content="$t('label.obsolete')"
      span
    />
    <template v-else>
      <my-field label="label.pskill">
        <my-text
          :content="recipeFeature.skillName"
          span
          :route="{
            name: 'jsonItem',
            params: {
              jsonType: 'skill',
              jsonId: recipeFeature.skill_used,
            },
          }"
        />
        <my-text :content="`(${recipeFeature.difficulty ?? 0})`" span />
      </my-field>

      <my-field label="label.skills" v-if="isNotEmpty(recipeFeature.skills)">
        <my-text :content="recipeFeature.skills" v-slot:default="{ item }">
          <my-text :content="item.name" span />
          <my-text :content="`(${item.level ?? 0})`" span />
        </my-text>
      </my-field>

      <my-field
        label="label.byproducts"
        v-if="isNotEmpty(recipeFeature.byproducts)"
      >
        <my-text :content="recipeFeature.byproducts" v-slot:default="{ item }">
          <my-text
            :content="item.name"
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'item',
                jsonId: item.id,
              },
            }"
            span
          />
          <my-text :content="` x ${item.amount}`" span />
        </my-text>
      </my-field>

      <my-field label="label.category">
        <my-text
          :content="recipeFeature.categoryName"
          span
          :route="{
            name: 'jsonItem',
            params: {
              jsonType: 'recipe_category',
              jsonId: recipeFeature.category,
            },
          }"
        />
        <my-text :content="' / ' + recipeFeature.subcategoryName" span />
      </my-field>

      <my-field label="label.time">
        <my-text :content="recipeFeature.time" />
      </my-field>

      <my-field label="label.reversible" v-if="recipeFeature.reversible">
        <my-text :content="recipeFeature.reversible" />
      </my-field>

      <my-field label="label.activityLevel">
        <my-text :content="recipeFeature.activityLevelName" />
      </my-field>

      <my-field label="label.batch_time" v-if="recipeFeature.batchTime" dl>
        <my-field label="label.time" v-if="recipeFeature.batchTime">
          <my-text :content="recipeFeature.batchTime.multiplier + '%'" />
        </my-field>

        <my-field label="label.amount" v-if="recipeFeature.batchTime">
          <my-text :content="recipeFeature.batchTime.amount" />
        </my-field>
      </my-field>

      <my-field label="label.proficiency">
        <my-text
          :content="recipeFeature.requirement.proficiencies"
          v-slot:default="{ item }"
        >
          <my-text
            :content="item.name"
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'proficiency',
                jsonId: item.proficiency,
              },
            }"
            span
          />
          <my-text
            :content="`(${item.time_multiplier} x ${$t('label.time')}`"
            span
          />
          <my-text
            v-if="item.fail_multiplier && item.fail_multiplier != 1"
            :content="`, ${item.fail_multiplier} x  ${$t('label.fail')}`"
            span
          />
          <my-text
            v-if="
              item.learning_time_multiplier &&
              item.learning_time_multiplier != 1
            "
            :content="`, ${item.learning_time_multiplier} x  ${$t(
              'label.learning_speed'
            )}`"
            span
          />
          <my-text content=")" span />
        </my-text>
      </my-field>

      <my-field label="label.tools">
        <ul>
          <li
            v-for="qualitie in recipeFeature.requirement.qualities"
            :key="qualitie.id"
          >
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
          <li
            v-for="(tools, index) in recipeFeature.requirement.tools"
            :key="index"
          >
            <template v-for="(tool, index) in tools" :key="tool.id">
              <my-text
                :content="tool.name"
                :route="{
                  name: 'jsonItem',
                  params: {
                    jsonType: 'item',
                    jsonId: tool.id,
                  },
                }"
                span
              />
              <my-text
                v-if="tool.amount > 0"
                :content="` (${tool.amount})`"
                span
              />
              <my-text
                v-if="index < tools.length - 1"
                :content="' ' + $t('or') + ' '"
                span
              />
            </template>
          </li>
        </ul>
      </my-field>

      <my-field label="label.components">
        <my-text
          :content="recipeFeature.requirement.components"
          v-slot:default="{ item }"
        >
          <template v-for="(component, index) in item" :key="component.id">
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
            <my-text
              v-if="index < item.length - 1"
              :content="' ' + $t('or') + ' '"
              span
            />
          </template>
        </my-text>
      </my-field>

      <my-field label="label.autolearn" v-if="recipeFeature.autoLearn">
        <my-text :content="recipeFeature.autoLearn" v-slot:default="{ item }">
          <my-text :content="item.name" span />
          <my-text :content="`(${item.level ?? 0})`" span />
        </my-text>
      </my-field>

      <my-field label="label.decompLearn" v-if="recipeFeature.decompLearn">
        <my-text :content="recipeFeature.decompLearn" v-slot:default="{ item }">
          <my-text :content="item.name" span />
          <my-text :content="`(${item.level ?? 0})`" span />
        </my-text>
      </my-field>

      <my-field label="label.bookLearn" v-if="recipeFeature.bookLearn">
        <my-text :content="recipeFeature.bookLearn" v-slot:default="{ item }">
          <my-text
            :content="item.name"
            span
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'item',
                jsonId: item.id,
              },
            }"
          />
          <my-text :content="`(${item.skill_level ?? 0})`" span />
        </my-text>
      </my-field>
    </template>
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initRecipeFeature, validate } from 'src/features/type/other/Recipe';
import MyCard from './myComponents/MyCard.vue';
import MyField from './myComponents/MyField.vue';
import MyText from './myComponents/MyText/MyText.vue';
import { isNotEmpty } from 'src/utils';
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
const isShow = validate(props.jsonItem);
let recipeFeature;
if (isShow) {
  recipeFeature = reactive(initRecipeFeature(props.jsonItem));
}
</script>
