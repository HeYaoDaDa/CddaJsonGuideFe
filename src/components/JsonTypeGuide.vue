<template>
  <template v-for="(value, key) in props.dataMap" :key="key">
    <q-expansion-item
      v-if="typeof value === 'object'"
      expand-separator
      :label="key"
    >
      <json-type-guide :dataMap="value" />
    </q-expansion-item>

    <q-item clickable tag="a" target="_blank" v-else>
      <q-item-section>
        <q-item-label>{{ key }}</q-item-label>
        <q-item-label caption>
          {{ value }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </template>
</template>

<script lang="ts">
export default {
  name: 'JsonTypeGuide',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
  dataMap: {
    type: Object,
    required: true,
  },
});
</script>
