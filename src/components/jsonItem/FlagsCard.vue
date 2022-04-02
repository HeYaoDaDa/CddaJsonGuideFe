<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold">Flags:</p>
      <p class="text-body2 text-weight-regular">
        <span v-for="(flag, index) in flagsItem.flags" :key="flag">
          {{ flag }}
          <span v-if="index < flagsItem.flags.length - 1">, </span>
        </span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { parserFlagsItem } from 'src/utils/CardUtil';
import { ref } from 'vue';
import { isItem } from 'src/utils/JsonItemUtil';
export default {
  name: 'FlagsCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow =
  isItem(props.jsonItem.type) &&
  (
    props.jsonItem.content as {
      flags?: string[];
    }
  ).flags;
const flagsItem = ref(parserFlagsItem(props.jsonItem));
</script>
