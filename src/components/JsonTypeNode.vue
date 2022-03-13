<template>
  <template v-for="node in props.datas" :key="node.id">
    <q-expansion-item
      v-if="haveSub(node)"
      expand-separator
      :label="$t('label.' + node.name)"
    >
      <json-type-node :datas="node.sub" />
    </q-expansion-item>

    <q-item clickable tag="a" target="_blank" v-else>
      <q-item-section>
        <q-item-label @click="toList(node.id)">{{ node.name }}</q-item-label>
        <q-item-label caption>
          {{ node.id }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </template>
</template>

<script lang="ts">
export default {
  name: 'JsonTypeNode',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { showAjaxFailNotify } from 'src/api';

const $router = useRouter();
const props = defineProps({
  datas: {
    type: Array,
    default: () => [],
    required: true,
  },
});

function toList(category: string) {
  $router
    .push({ name: 'search', query: { category: category } })
    .catch(() => showAjaxFailNotify());
}

function haveSub(node: TypeTreeNode): boolean {
  return node.sub.length > 0;
}
</script>
