<template>
  <dt>
    <optional-route
      :content="$t('label.' + props.label)"
      $route="props.route"
    />
  </dt>
  <dd>
    <dl v-if="dl">
      <slot></slot>
    </dl>
    <ul v-if="ul">
      <slot></slot>
    </ul>
    <slot v-if="!(dl || ul)"></slot>
  </dd>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import OptionalRoute from './MyText/OptionalRoute.vue';
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
  ul?: boolean;
}>();
</script>
