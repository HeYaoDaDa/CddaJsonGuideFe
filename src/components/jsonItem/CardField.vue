<template>
  <p
    class="text-subtitle1 text-weight-bold"
    v-if="!column.hideInCard && (column.required || field)"
  >
    {{ column.label }}:

    <router-link
      class="text-body2 text-weight-regular"
      :to="column.route(props.jsonItem)"
      v-if="column.route"
      >{{
        typeof column.field === 'function'
          ? column.field(props.jsonItem)
          : column.field
      }}</router-link
    >

    <span class="text-body2 text-weight-regular" v-else>{{
      typeof column.field === 'function'
        ? column.field(props.jsonItem)
        : column.field
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
  } else {
    field = ref(props.column.field);
  }
}
</script>
