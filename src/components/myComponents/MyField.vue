<template>
  <dt>
    <p v-if="!props.route">
      {{ $t(props.label) }}
    </p>
    <router-link :to="props.route" v-else>{{ $t(props.label) }}</router-link>
  </dt>
  <dd>
    <dl v-if="dl">
      <slot></slot>
    </dl>
    <slot v-else></slot>
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
  dl?: boolean;
}>();
</script>
