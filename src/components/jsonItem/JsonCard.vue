<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <q-expansion-item expand-separator label="JSON">
        <pre>{{ json }}</pre>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { getHaveAndValue } from 'src/api';
import { reactive, ref } from 'vue';
export default {
  name: 'JsonCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const json = ref(JSON.stringify(props.jsonItem.content, null, 4).trim());
const isShow = json.value != undefined;
</script>
