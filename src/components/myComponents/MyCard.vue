<template>
  <q-card class="col q-my-sm q-mx-xs">
    <q-card-section>
      <p class="text-h6 text-weight-bold" v-if="!props.route">
        {{ $t(props.label) }}
      </p>
      <router-link class="text-h6 text-weight-bold" :to="props.route" v-else>{{
        $t(props.label)
      }}</router-link>
      <dl>
        <slot></slot>
      </dl>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
export default {
  name: 'MyCard',
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

<style lang="scss">
dl {
  display: grid;
  grid-template-columns: max-content auto;
}

dd {
  margin-inline-start: 1rem;
}

dd ul {
  padding-left: 1em;
}
</style>
