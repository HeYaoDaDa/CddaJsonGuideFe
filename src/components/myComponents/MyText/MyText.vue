<template>
  <template v-if="typeof props.content === 'object'">
    <template v-for="(contentItem, index) in props.content" :key="contentItem">
      <my-text-part
        :content="contentItem"
        :route="route && typeof route === 'object' ? route[index] : undefined"
        :span="props.span"
      />
      <my-text-part
        v-if="props.separator && index < props.content.length - 1"
        :content="props.separator"
        span
      />
    </template>
  </template>
  <my-text-part v-else :content="props.content" :route="props.route" />
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import MyTextPart from './MyTextPart.vue';
export default {
  name: 'MyText',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: string | number | boolean | string[] | number[] | boolean[];
  route?: RouteLocationRaw | (RouteLocationRaw | undefined)[];
  separator?: string;
  span?: boolean;
}>();
</script>
