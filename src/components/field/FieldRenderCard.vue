<template>
  <dl v-if="props.myField.label">
    <field-render-part
      :myField="props.myField"
      :myStyle="fieldStyle"
      :separator="props.isEnd ? '' : props.separator"
    />
  </dl>
  <template v-else>
    <field-render-part
      :myField="props.myField"
      :myStyle="fieldStyle"
      :separator="props.isEnd ? '' : props.separator"
    />
  </template>
</template>

<script lang="ts">
import { Field, FieldStyle } from 'src/type/FieldType';
import { ref } from 'vue';
import FieldRenderPart from './FieldRenderPart.vue';

export default {
  name: 'FieldRenderCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  myField: Field;
  myStyle?: FieldStyle;
  separator?: string;
  isEnd?: boolean;
}>();
const fieldStyle = ref(
  props.myStyle === undefined ? FieldStyle.OBJECT : props.myStyle
);
</script>
