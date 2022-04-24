<template>
  <li v-if="props.li">
    <optional-route :content="props.content" :route="props.route" />
  </li>
  <p v-if="props.p">
    <optional-route :content="props.content" :route="props.route" />
  </p>
  <span v-if="!(props.p || props.li)"
    ><optional-route :content="props.content" :route="props.route"
  /></span>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import OptionalRoute from './OptionalRoute.vue';
export default {
  name: 'MyTextPart',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: string | number | boolean;
  route?: RouteLocationRaw;
  p?: boolean;
  li?: boolean;
}>();
</script>
