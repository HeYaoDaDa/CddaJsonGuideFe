<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="flags.have && isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold">Flags:</p>
      <p class="text-body2 text-weight-regular">
        <span v-for="(flag, index) in flags.value" :key="flag">
          {{ flag }}
          <span v-if="index < flags.value.length - 1">, </span>
        </span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { getHaveAndValue } from 'src/api';
import { reactive, ref } from 'vue';
export default {
  name: 'FlagsCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
interface FlagsItem {
  flags: string | string[] | undefined;
}
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const json = ref(props.jsonItem.content as FlagsItem);
const isShow = json.value != undefined;
const flags = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'flags',
    def: '',
  })
);
</script>
