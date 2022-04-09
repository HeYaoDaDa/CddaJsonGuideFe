<template>
  <router-link v-if="props.route" :to="props.route">{{
    props.content
  }}</router-link>
  <p v-else>{{ props.content }}</p>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
export default {
  name: 'MyText',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content: string | number | boolean;
  route?: RouteLocationRaw;
}>();
</script>
