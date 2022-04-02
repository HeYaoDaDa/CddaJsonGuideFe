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
import { useStore } from 'src/store';
import { useI18n } from 'vue-i18n';
import { getJsonItemsByItemType } from 'src/api';
import { getName } from 'src/utils/JsonItemUtil';
import { addBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
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
  void getJsonItemsByItemType('tool_quality').then((jsonItems) => {
    const qualities = {
      name: i18n.t('label.qualities'),
      id: 'qualities',
      sub: new Array<TypeTreeNode>(),
    };
    for (const jsonItem of jsonItems) {
      addBaseJsonItem(jsonItem);
      qualities.sub.push({
        name: getName(jsonItem),
        id: jsonItem.jsonId,
        sub: [],
      });
    }
    jsonTypeTree.value.push(qualities);
  });
  isShow.value = true;
}

watch(
  computed({
    get: () => [config.language, config.version],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => update()
);
</script>
