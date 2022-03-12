<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold" v-if="weapon_category.have">
        可用武器类别:
        <span class="text-body2 text-weight-regular">{{
          weapon_category.value
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        钝击:
        <span class="text-body2 text-weight-regular">{{ bashing.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        斩击:
        <span class="text-body2 text-weight-regular">{{ cutting.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        刺击:
        <span class="text-body2 text-weight-regular">{{ piercing.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        命中:
        <span class="text-body2 text-weight-regular">{{ to_hit.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        基础攻击耗时:
        <span class="text-body2 text-weight-regular">{{ perAttackTime }}</span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { getHaveAndValue } from 'src/api';
import { reactive, ref } from 'vue';
import { parseVolumeToMl, parseWeightToG } from 'src/api/DataUtil';
export default {
  name: 'AttackCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
interface ToHit {
  grip: string;
  length: string;
  surface: string;
  balance: string;
}
interface AttackItem {
  weapon_category: string | string[] | undefined;
  bashing: number | undefined;
  cutting: number | undefined;
  piercing: number | undefined;
  to_hit: number | ToHit | undefined;
  volume: string | number;
  weight: string | number;
}
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const json = ref(props.jsonItem.content as AttackItem);
const isShow = json.value != undefined;
const weapon_category = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'weapon_category',
    def: '',
  })
);
const bashing = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'bashing',
    def: 0,
  })
);
const cutting = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'cutting',
    def: 0,
  })
);
const piercing = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'piercing',
    def: 0,
  })
);
const to_hit = reactive(
  getHaveAndValue({
    obj: json.value,
    key: 'to_hit',
    def: 0,
  })
);
const perAttackTime =
  65 +
  Math.floor(parseVolumeToMl(json.value.volume) / 62.5) +
  Math.floor(parseWeightToG(json.value.weight) / 60);
</script>
