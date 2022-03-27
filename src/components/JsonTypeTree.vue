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
import { featureFactorys } from 'src/features';
import { computed, ref, watch } from 'vue';
// import { getJsonTypeTree } from 'src/api';
import { useStore } from 'src/store';
import { useI18n } from 'vue-i18n';
// import { showAjaxFailNotify } from 'src/utils';
const $store = useStore();
const config = $store.state.userConfig;
const isShow = ref(false);
const jsonTypeTree = ref([] as TypeTreeNode[]);
const i18n = useI18n();
update();

function update() {
  jsonTypeTree.value = featureFactorys.map((featureFactory) => {
    return {
      name: i18n.t(featureFactory.getFeatureHandler().label),
      id: featureFactory.featureKey,
      sub: [],
    };
  });
  isShow.value = true;
  // getJsonTypeTree(config)
  //   .then((itemTypeTree) => {
  //     jsonTypeTree.value = [itemTypeTree];
  //     isShow.value = true;
  //   })
  //   .catch(() => showAjaxFailNotify());
}

watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => update()
);
</script>
