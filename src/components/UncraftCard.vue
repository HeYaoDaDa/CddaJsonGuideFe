<template>
  <my-card
    label="label.uncraft"
    v-if="isShow"
    :route="{
      name: 'jsonItem',
      params: {
        jsonType: 'uncraft',
        jsonId: uncraftFeature.result,
      },
    }"
  >
    <my-field label="label.time">
      <my-text :content="uncraftFeature.time" />
    </my-field>

    <my-field label="label.proficiency">
      <my-text
        :content="uncraftFeature.requirement.proficiencies"
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
            item.learning_time_multiplier && item.learning_time_multiplier != 1
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
          v-for="qualitie in uncraftFeature.requirement.qualities"
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
          v-for="(tools, index) in uncraftFeature.requirement.tools"
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
        :content="uncraftFeature.requirement.components"
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
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initUncraftFeature, validate } from 'src/features/type/other/Uncraft';
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
const isShow = validate(props.jsonItem);
let uncraftFeature;
if (isShow) {
  uncraftFeature = reactive(initUncraftFeature(props.jsonItem));
}
</script>
