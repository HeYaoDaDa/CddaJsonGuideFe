<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <span
        class="text-weight-bold text-h4"
        :style="{ color: allItem.color }"
        v-if="allItem.symbol"
        >{{ allItem.symbol }}</span
      >
      <span class="text-weight-bold text-h3">
        {{ itemName }}
      </span>
      <q-badge v-if="isShowMod" class="text-h4" @click="goModInfo">{{
        modName
      }}</q-badge>
      <p class="text-body1" v-if="allItem.description">
        {{ allItem.description }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { getLocalModById } from 'src/utils/DataUtil';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { parserAllItem, getObjectString } from 'src/utils/CardUtil';
import { getJsonItemListByJsonId } from 'src/api';
import { getName } from 'src/utils/JsonItemUtil';
export default {
  name: 'NameCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const $store = useStore();
const isShow = props.jsonItem != undefined;
const allItem = ref(parserAllItem(props.jsonItem.content));
const $router = useRouter();

const isShowMod = ref(props.jsonItem.type.toLowerCase() != 'mod_info');
const modName = ref(props.jsonItem.mod);
const itemName = ref('');
const config = $store.state.userConfig;
const mod = getLocalModById(config, props.jsonItem.mod);
if (mod) {
  modName.value = mod.name;
}

switch (props.jsonItem.type) {
  case 'recipe':
    const tempResultContent = allItem.value as { result?: string };
    if (tempResultContent.result) {
      void getJsonItemListByJsonId('item', tempResultContent.result).then(
        (jsonItems) => {
          if (jsonItems && jsonItems.length > 0) {
            itemName.value = getName(jsonItems[0]);
          }
        }
      );
    }
    break;
  default:
    const tempNameContent = allItem.value as { name: string | object };
    if (tempNameContent.name) {
      itemName.value = getObjectString(tempNameContent.name);
    }
}
function goModInfo() {
  void $router.push({
    name: 'jsonItem',
    params: { jsonType: 'mod_info', jsonId: props.jsonItem.mod },
  });
}
</script>
