<template>
  <template v-for="node in props.datas" :key="node.id">
    <q-expansion-item v-if="haveSub(node)" expand-separator :label="node.name">
      <json-type-guide :datas="node.sub" />
    </q-expansion-item>

    <q-item clickable tag="a" target="_blank" v-else>
      <q-item-section>
        <q-item-label>{{ node.name }}</q-item-label>
        <q-item-label caption>
          {{ node.id }}
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
  datas: {
    type: Array,
    default: () => [],
    required: true,
  },
});

function haveSub(node: TypeTreeNode): boolean {
  console.log(node);
  return node.sub.length > 0;
}
</script>
