<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold" v-if="materials.have">
        材质:
        <span class="text-body2 text-weight-regular">
          <span v-for="(material, index) in materials.value" :key="material">
            {{ material }}
            <span v-if="index < materials.value.length - 1">, </span></span
          >
        </span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="volume.have">
        体积:
        <span class="text-body2 text-weight-regular">{{ volume.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="weight.have">
        重量:
        <span class="text-body2 text-weight-regular">{{ weight.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        长度:
        <span class="text-body2 text-weight-regular">{{ length.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="category.have">
        类别:
        <span class="text-body2 text-weight-regular">{{ category.value }}</span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { getHaveAndValue } from 'src/api';
import { reactive } from 'vue';
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
const isShow = json.value != undefined;
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
