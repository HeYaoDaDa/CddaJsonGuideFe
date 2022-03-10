<template>
  <q-card v-if="isShow">
    <q-card-section>
      <h3>
        {{ getName() }}
      </h3>
      <label>{{ jsonItem.mod }}</label>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
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

function getName(): string {
  if ('name' in props.jsonItem.content) {
    const content = props.jsonItem.content as { name: string | object };
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
    console.error('miss find name', props.jsonItem.content);
    return '';
  }
}
</script>
