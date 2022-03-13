<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold" v-if="encumbrance.have">
        {{ $t('label.encumbrance') }}:
        <span
          v-if="typeof encumbrance.value === 'number'"
          class="text-body2 text-weight-regular"
          >{{ encumbrance.value }}</span
        >
        <span v-else class="text-body2 text-weight-regular"
          >{{ encumbrance.value[0] }}, {{ encumbrance.value[1] }}</span
        >
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="coverage.have">
        {{ $t('label.coverage') }}:
        <span class="text-body2 text-weight-regular">{{ coverage.value }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="cover_melee.have">
        {{ $t('label.cover_melee') }}:
        <span class="text-body2 text-weight-regular">{{
          cover_melee.value
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="cover_ranged.have">
        {{ $t('label.cover_ranged') }}:
        <span class="text-body2 text-weight-regular">{{
          cover_ranged.value
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="cover_vitals.have">
        {{ $t('label.cover_vitals') }}:
        <span class="text-body2 text-weight-regular">{{
          cover_vitals.value
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="covers.have">
        {{ $t('label.covers') }}:
        <span class="text-body2 text-weight-regular">
          <span v-for="(cover, index) in covers.value" :key="cover">
            {{ cover }}
            <span v-if="index < covers.value.length - 1">, </span></span
          >
        </span>
      </p>
      <p
        class="text-subtitle1 text-weight-bold"
        v-if="specifically_covers.have"
      >
        {{ $t('label.specifically_covers') }}:
        <span class="text-body2 text-weight-regular">
          <span
            v-for="(cover, index) in specifically_covers.value"
            :key="cover"
          >
            {{ cover }}
            <span v-if="index < specifically_covers.value.length - 1"
              >,
            </span></span
          >
        </span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="material.have">
        {{ $t('label.material') }}:
        <span class="text-body2 text-weight-regular">
          <span v-for="(cover, index) in material.value" :key="cover">
            {{ cover }}
            <span v-if="index < material.value.length - 1">, </span></span
          >
        </span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { getHaveAndValue } from 'src/api';
import { reactive } from 'vue';
export default {
  name: 'ArmorCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
interface ArmorItem {
  armor: {
    encumbrance: number | number[];
    coverage: number;
    cover_melee: number;
    cover_ranged: number;
    cover_vitals: number;
    covers: string[];
    specifically_covers: string[];
    material:
      | {
          type: string;
          covered_by_mat: number;
          thickness: number;
        }[]
      | undefined;
  };
}
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const json = ref(props.jsonItem.content as ArmorItem);
const isShow = json.value && json.value.armor;
const armor = json.value.armor;

const encumbrance = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'encumbrance',
    def: 0,
  })
);
const coverage = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'coverage',
    def: 0,
  })
);
const cover_melee = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'cover_melee',
    def: 0,
  })
);
const cover_ranged = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'cover_ranged',
    def: 0,
  })
);
const cover_vitals = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'cover_vitals',
    def: 0,
  })
);
const covers = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'covers',
    def: [],
  })
);
const specifically_covers = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'specifically_covers',
    def: [],
  })
);
//TODO
const material = reactive(
  getHaveAndValue({
    obj: armor,
    key: 'material',
    def: undefined,
  })
);
</script>
