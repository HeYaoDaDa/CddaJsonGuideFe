<template>
  <my-card label="label.flags" v-if="isShow">
    <my-field label="label.flags">
      <p class="text-body2 text-weight-regular">
        <ul>
          <li v-for="flag in flagsItem.flags" :key="flag">
            <my-text :content="flag"/>
          </li>
        </ul>
      </p>
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { parserFlagsItem } from 'src/utils/CardUtil';
import { ref } from 'vue';
import { isItem } from 'src/utils/JsonItemUtil';
import MyCard from '../myComponents/MyCard.vue';
import MyField from '../myComponents/MyField.vue';
import MyText from '../myComponents/MyText.vue';
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
