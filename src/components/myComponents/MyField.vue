<template>
  <dt>
    <p v-if="route">{{ $t(label) }}</p>
    <router-link v-else>{{ $t(label) }}</router-link>
  </dt>
  <dd>
    <slot></slot>
  </dd>
</template>

<script lang="ts">
import { toRefs } from 'vue';
import { RouteLocationRaw } from 'vue-router';
export default {
  name: 'MyField',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const { label, route } = toRefs(
  defineProps<{
    label: string;
    route?: RouteLocationRaw;
  }>()
);
</script>
