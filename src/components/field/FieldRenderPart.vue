<template>
  <dt v-if="props.myField.label" class="text-subtitle1 text-weight-bold">
    <router-link :to="props.myField.labelRoute" v-if="props.myField.labelRoute">
      {{ props.myField.label }} :
    </router-link>
    <span v-else> {{ props.myField.label }} : </span>
  </dt>
  <template v-if="typeof props.myField.content === 'object'">
    <dd v-if="props.myStyle === FieldStyle.OBJECT">
      <field-render-card
        v-for="(subField, index) in props.myField.content"
        :key="subField"
        :myField="subField"
        :myStyle="props.myField.style"
        :separator="props.myField.separator"
        :isEnd="index == props.myField.content.length - 1"
      />
    </dd>
    <template v-else>
      <field-render-card
        v-for="(subField, index) in props.myField.content"
        :key="subField"
        :myField="subField"
        :myStyle="props.myField.style"
        :separator="props.myField.separator"
        :isEnd="index == props.myField.content.length - 1"
      />
      <span>{{ props.separator }}</span>
    </template>
  </template>
  <template v-else class="text-body2 text-weight-regular">
    <dd v-if="props.myStyle === FieldStyle.OBJECT">
      <router-link
        :to="props.myField.contentRoute"
        v-if="props.myField.contentRoute"
      >
        {{ content }}
      </router-link>
      <span v-else>
        {{ content }}
      </span>
    </dd>
    <span v-else>
      <router-link
        :to="props.myField.contentRoute"
        v-if="props.myField.contentRoute"
      >
        {{ content }}
      </router-link>
      <span v-else>
        {{ content }}
      </span>
    </span>
  </template>
</template>

<script lang="ts">
import { Field, FieldStyle } from 'src/type/FieldType';
import { computed } from 'vue';
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
  myStyle: FieldStyle;
  separator?: string;
}>();
const content = computed({
  get: () =>
    typeof props.myField.content === 'function'
      ? props.myField.content()
      : props.myField.content,
  set: () => console.error('no should set'),
});
</script>
