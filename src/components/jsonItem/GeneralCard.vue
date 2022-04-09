<template>
  <my-card label="label.item" v-if="isShow">
    <my-field label="label.materials">
      <my-text :content="materialNames" separator=", " :route="routes" span />
    </my-field>
    <my-field label="label.volume">
      <my-text :content="generalItem.volume" />
    </my-field>
    <my-field label="label.weight">
      <my-text :content="generalItem.weight" />
    </my-field>
    <my-field label="label.length">
      <my-text :content="generalItem.length" />
    </my-field>
    <my-field label="label.category" v-if="generalItem.category">
      <my-text :content="generalItem.categoryName" />
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from '@vue/reactivity';
import { initGeneralFeature } from 'src/features/type/item/General';
import { isItem } from 'src/utils/JsonItemUtil';
import MyCard from '../myComponents/MyCard.vue';
import MyField from '../myComponents/MyField.vue';
import MyText from '../myComponents/MyText/MyText.vue';
import { computed } from '@vue/runtime-core';
import { changeOnlyReadlyComputed } from 'src/constant/LogConstant';
export default {
  name: 'GeneralCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = isItem(props.jsonItem.type);
const generalItem = reactive(initGeneralFeature(props.jsonItem));
const materialNames = computed({
  get: () => generalItem.materials.map((material) => material.name),
  set: () => {
    console.error(changeOnlyReadlyComputed);
  },
});
const routes = computed({
  get: () =>
    generalItem.materials.map((material) => {
      return {
        name: 'jsonItem',
        params: {
          jsonType: 'material',
          jsonId: material.id,
        },
      };
    }),
  set: () => {
    console.error(changeOnlyReadlyComputed);
  },
});
</script>
