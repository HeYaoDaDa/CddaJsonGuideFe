<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <span
        class="text-weight-bold text-h4"
        :style="{ color: json.color }"
        v-if="isShowSymbol"
        >{{ json.symbol }}</span
      >
      <span class="text-weight-bold text-h3">
        {{ getName(json) }}
      </span>
      <q-badge class="text-h4">{{ modName }}</q-badge>
      <p class="text-body1" v-if="isShowDescription">{{ description }}</p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { getModById } from 'src/api';
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

const isShow = props.jsonItem != undefined;
const json = ref(props.jsonItem.content);
const isShowSymbol = 'symbol' in json.value;
const isShowDescription = 'description' in json.value;
const modName = ref(props.jsonItem.mod);
const description = ref('');
void getModById(modName.value).then((value) => {
  modName.value = getName(value.content);
});

if (isShowDescription) {
  const typeJson = json.value as { description: string };
  description.value = typeJson.description;
}

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
</script>
