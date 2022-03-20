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
        {{ getObjectString(allItem.name) }}
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
export default {
  name: 'AllCard',
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
const config = $store.state.userConfig;
const mod = getLocalModById(config, props.jsonItem.mod);
if (mod) {
  modName.value = mod.name;
}

function goModInfo() {
  void $router.push({
    name: 'jsonItem',
    params: { jsonType: 'mod_info', jsonId: props.jsonItem.mod },
  });
}
</script>
