<template>
  <dt v-if="field.label" class="text-subtitle1 text-weight-bold">
    <router-link :to="field.labelRoute" v-if="field.labelRoute">
      {{ field.label }}
    </router-link>
    <span v-else>
      {{ field.label }}
    </span>
  </dt>
  <dd v-if="typeof field.content === 'object'">
    <field-render-card
      v-for="subField in field.content"
      :key="subField"
      :myField="subField"
      :myStyle="field.style"
    />
  </dd>
  <template v-else class="text-body2 text-weight-regular">
    <dd v-if="fieldStyle === FieldStyle.OBJECT">
      <router-link :to="field.contentRoute" v-if="field.contentRoute">
        {{
          typeof field.content === 'function' ? field.content() : field.content
        }}
      </router-link>
      <span v-else>
        {{
          typeof field.content === 'function' ? field.content() : field.content
        }}
      </span>
    </dd>
    <span v-else>
      <router-link :to="field.contentRoute" v-if="field.contentRoute">
        {{
          typeof field.content === 'function' ? field.content() : field.content
        }}
      </router-link>
      <span v-else>
        {{
          typeof field.content === 'function' ? field.content() : field.content
        }}
      </span>
    </span>
  </template>
</template>

<script lang="ts">
import { Field, FieldStyle } from 'src/type/FieldType';
import { ref } from 'vue';
import FieldRenderCard from './FieldRenderCard.vue';

export default {
  name: 'FieldRenderPart',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  myField: Field;
  myStyle?: FieldStyle;
}>();
const field = ref(props.myField);
const fieldStyle = ref(
  props.myStyle === undefined ? FieldStyle.OBJECT : props.myStyle
);
</script>
