<template>
  <p
    class="text-subtitle1 text-weight-bold"
    v-if="!column.hideInCard && (column.required || field)"
  >
    {{ column.label }}:
    <span class="text-body2 text-weight-regular" @click="route">{{
      typeof column.field === 'function'
        ? column.field(props.feature)
        : row[props.feature]
    }}</span>
  </p>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ColumnInterface } from 'src/type';

export default {
  name: 'CardField',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  column: ColumnInterface<unknown>;
  jsonItem: JsonItem;
  feature: unknown;
}>();
const $router = useRouter();
const column = ref(props.column);
let field = ref('' as string | number | undefined);
if (props.column.field) {
  if (typeof props.column.field === 'function') {
    field.value = props.column.field(props.feature);
  } else {
    field = ref(props.column.field);
  }
}

function route() {
  if (column.value.route) {
    const routeLocale = column.value.route(props.jsonItem);
    if (routeLocale) {
      void $router.push(routeLocale);
    }
  }
}
</script>
