<template>
  <my-card label="label.qualities" v-if="isShow">
    <span class="text-body2 text-weight-regular">
      <ul>
        <li v-for="qualitie in qualitiesFeature.qualities" :key="qualitie">
          <my-text
            :content="qualitie.name"
            :route="{
              name: 'feature',
              params: { feature: 'qualities', sub: qualitie.id },
            }"
            span
          />
          <my-text :content="`(${qualitie.level})`" span />
        </li>
      </ul>
    </span>
  </my-card>
</template>

<script lang="ts">
import MyCard from 'src/components/myComponents/MyCard.vue';
import MyText from 'src/components/myComponents/MyText/MyText.vue';
import {
  validate,
  initQualitiesFeature,
} from 'src/features/type/item/Qualities';
import { reactive, ref } from 'vue';
export default {
  name: 'QualitiesCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = ref(validate(props.jsonItem));
const qualitiesFeature = reactive(initQualitiesFeature(props.jsonItem));
</script>
