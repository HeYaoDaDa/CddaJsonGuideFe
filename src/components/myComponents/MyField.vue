<template>
  <dt>
    <p class="text-subtitle1 text-weight-bold" v-if="!props.route">
      {{ $t(props.label) }}
    </p>
    <router-link
      class="text-subtitle1 text-weight-bold"
      :to="props.route"
      v-else
      >{{ $t(props.label) }}</router-link
    >
  </dt>
  <dd>
    <slot></slot>
  </dd>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
export default {
  name: 'MyField',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  route?: RouteLocationRaw;
}>();
</script>
