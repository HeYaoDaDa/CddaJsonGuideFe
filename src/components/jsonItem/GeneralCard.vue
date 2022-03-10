<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold" v-if="isShowMaterial">
        材质:
        <span class="text-body2 text-weight-regular">
          <span v-for="(material, index) in materials" :key="material"
            >{{ material
            }}<span v-if="index < materials.length - 1">, </span></span
          >
        </span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="isShowVolume">
        体积: <span class="text-body2 text-weight-regular">{{ volume }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="isShowWeight">
        重量: <span class="text-body2 text-weight-regular">{{ weight }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        长度: <span class="text-body2 text-weight-regular">{{ length }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="isShowCategory">
        类别: <span class="text-body2 text-weight-regular">{{ category }}</span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
export default {
  name: 'GeneralCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  json: object;
}>();

const isShow = props.json != undefined;
const isShowMaterial = 'material' in props.json;
const isShowVolume = 'weight' in props.json;
const isShowWeight = 'weight' in props.json;
const isShowLength = 'length' in props.json;
const isShowCategory = 'category' in props.json;

const materials = ref(['null']);
const volume = ref('1 L');
const weight = ref('1 kg');
const length = ref('37 cm');
const category = ref('null');

if (isShowMaterial) {
  const typeJson = props.json as { material: [] | string };
  materials.value =
    typeof typeJson.material == 'string'
      ? [typeJson.material]
      : typeJson.material;
}

if (isShowVolume) {
  const typeJson = props.json as { volume: string };
  volume.value = typeJson.volume;
}

if (isShowWeight) {
  const typeJson = props.json as { weight: string };
  weight.value = typeJson.weight;
}

if (isShowLength) {
  const typeJson = props.json as { length: string };
  length.value = typeJson.length;
}

if (isShowCategory) {
  const typeJson = props.json as { category: string };
  category.value = typeJson.category;
}
</script>
