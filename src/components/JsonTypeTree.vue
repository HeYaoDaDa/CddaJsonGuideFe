<template>
  <json-type-node :datas="jsonTypeTree" v-if="isShow" />
  <q-spinner v-else />
</template>

<script lang="ts">
export default {
  name: 'JsonTypeTree',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import JsonTypeNode from 'src/components/JsonTypeNode.vue';
import { computed, ref, watch } from 'vue';
import { getJsonTypeTree, showAjaxFailNotify } from 'src/api';
import { useStore } from 'src/store';
const $store = useStore();
const config = $store.state.userConfig;
const isShow = ref(false);
const jsonTypeTree = ref([] as TypeTreeNode[]);
update();

function update() {
  getJsonTypeTree(config)
    .then((itemTypeTree) => {
      jsonTypeTree.value = [itemTypeTree];
      isShow.value = true;
    })
    .catch(() => showAjaxFailNotify());
}

watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => update()
);
</script>
