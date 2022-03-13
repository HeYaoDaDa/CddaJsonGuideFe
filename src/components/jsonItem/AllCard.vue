<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <span
        class="text-weight-bold text-h4"
        :style="{ color: json.color }"
        v-if="symbol.have"
        >{{ symbol.value }}</span
      >
      <span class="text-weight-bold text-h3">
        {{ getName(json) }}
      </span>
      <q-badge v-if="isShowMod" class="text-h4" @click="goModInfo">{{
        modName
      }}</q-badge>
      <p class="text-body1" v-if="description.have">{{ description.value }}</p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { getLocalModById } from 'src/api/DataUtil';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { getHaveAndValue } from 'src/api';
import { reactive } from 'vue';
export default {
  name: 'AllCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
interface AllItem {
  name: string | object;
  description: string | object;
  symbol: string | number;
}
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const $store = useStore();
const config = $store.state.userConfig;
const isShow = props.jsonItem != undefined;
const json = ref(props.jsonItem.content as AllItem);
const modName = ref(props.jsonItem.mod);
const $router = useRouter();
const isShowMod = ref(props.jsonItem.type.toLowerCase() != 'mod_info');

const mod = getLocalModById(config, props.jsonItem.mod);
if (mod) {
  modName.value = mod.name;
}

const description = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'description',
    def: '',
  })
);

const symbol = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'symbol',
    def: '',
  })
);

function getName(json: object): string {
  if ('name' in json) {
    const content = json as { name: string | object };
    const name = content.name;
    if (typeof name == 'string') {
      return name as unknown as string;
    } else if (typeof name == 'object' && 'str' in name) {
      const nameStr = name as unknown as { str: string };
      return nameStr.str;
    } else {
      console.error('fail find name', name);
      return '';
    }
  } else {
    console.error('miss find name', json);
    return '';
  }
}

function goModInfo() {
  $router
    .push({
      name: 'jsonItem',
      params: { jsonType: 'mod_info', jsonId: props.jsonItem.mod },
    })
    .catch(() => console.log('error'));
}
</script>
