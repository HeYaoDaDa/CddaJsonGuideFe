<template>
  <router-link v-if="props.route" :to="props.route">{{
    props.content
  }}</router-link>
  <template v-else>
    <span v-if="span">{{ props.content }}</span>
    <p v-else>{{ props.content }}</p>
  </template>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
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
  span?: boolean;
}>();
</script>
