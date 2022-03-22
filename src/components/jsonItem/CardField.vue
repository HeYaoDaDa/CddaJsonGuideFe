<template>
  <p
    class="text-subtitle1 text-weight-bold"
    v-if="!column.hideInCard && (column.required || field)"
  >
    {{ column.label }}:
    <span class="text-body2 text-weight-regular">{{
      typeof column.field === 'function'
        ? column.field(props.jsonItem)
        : row[props.jsonItem]
    }}</span>
  </p>
</template>

<script lang="ts">
import { ref } from 'vue';
import { ColumnInterface } from 'src/type';

export default {
  name: 'CardField',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  column: ColumnInterface;
  jsonItem: JsonItem;
}>();
const column = ref(props.column);
let field = ref('' as string | number | undefined);
if (props.column.field) {
  if (typeof props.column.field === 'function') {
    field.value = props.column.field(props.jsonItem);
  } else if (typeof props.column.field === 'number') {
    field = ref(props.column.field);
  } else {
    const temp = typeof props.jsonItem[props.column.field];
    if (typeof temp in ['string', 'number']) {
      field.value = temp;
    }
  }
}
</script>
