<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold" v-if="materials.have">
        {{ $t('label.materials') }}:
        <span class="text-body2 text-weight-regular">
          <span v-for="(material, index) in materials.value" :key="material">
            {{ material }}
            <span v-if="index < materials.value.length - 1">, </span></span
          >
        </span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="volume.have">
        {{ $t('label.volume') }}:
        <span class="text-body2 text-weight-regular">{{ volume.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="weight.have">
        {{ $t('label.weight') }}:
        <span class="text-body2 text-weight-regular">{{ weight.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.length') }}:
        <span class="text-body2 text-weight-regular">{{ length.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="category.have">
        {{ $t('label.category') }}:
        <span class="text-body2 text-weight-regular">{{ category.value }}</span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { getHaveAndValue } from 'src/api';
import { reactive } from 'vue';
import { itemTypes } from 'src/constant';
export default {
  name: 'GeneralCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
interface General {
  material: string | string[] | undefined;
  volume: string;
  weight: string;
  length: string | undefined;
  category: string | undefined;
}
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const json = ref(props.jsonItem.content as General);
//TODO monster generalCard
const isShow =
  json.value != undefined &&
  itemTypes.includes(props.jsonItem.type.toLowerCase());
const materials = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'material',
    def: '',
  })
);
const volume = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'volume',
    def: '',
  })
);
const weight = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'weight',
    def: '',
  })
);
const length = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'length',
    def: '37 cm',
  })
);
const category = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'category',
    def: '',
  })
);
</script>
