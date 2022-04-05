<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p v-if="route">{{ $t(label) }}</p>
      <router-link v-else>{{ $t(label) }}</router-link>
      <dl>
        <slot></slot>
      </dl>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { toRefs } from 'vue';
import { RouteLocationRaw } from 'vue-router';
export default {
  name: 'MyCard',
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

<style lang="scss">
dl {
  display: grid;
  grid-template-columns: max-content auto;
}
</style>
