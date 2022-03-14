<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="armorItem">
    <q-card-section>
      <template v-for="armor in armorItem.armor" :key="armor">
        <p class="text-subtitle1 text-weight-bold" v-if="armor.encumbrance">
          {{ $t('label.encumbrance') }}:
          <span
            v-if="typeof armor.encumbrance === 'number'"
            class="text-body2 text-weight-regular"
            >{{ armor.encumbrance }}</span
          >
          <span v-else class="text-body2 text-weight-regular"
            >{{ armor.encumbrance[0] }}, {{ armor.encumbrance[1] }}</span
          >
        </p>
        <p class="text-subtitle1 text-weight-bold" v-if="armor.coverage">
          {{ $t('label.coverage') }}:
          <span class="text-body2 text-weight-regular">{{
            armor.coverage
          }}</span>
        </p>
        <p class="text-subtitle1 text-weight-bold" v-if="armor.cover_melee">
          {{ $t('label.cover_melee') }}:
          <span class="text-body2 text-weight-regular">{{
            armor.cover_melee
          }}</span>
        </p>
        <p class="text-subtitle1 text-weight-bold" v-if="armor.cover_ranged">
          {{ $t('label.cover_ranged') }}:
          <span class="text-body2 text-weight-regular">{{
            armor.cover_ranged
          }}</span>
        </p>
        <p class="text-subtitle1 text-weight-bold" v-if="armor.cover_vitals">
          {{ $t('label.cover_vitals') }}:
          <span class="text-body2 text-weight-regular">{{
            armor.cover_vitals
          }}</span>
        </p>
        <p class="text-subtitle1 text-weight-bold" v-if="armor.covers">
          {{ $t('label.covers') }}:
          <span class="text-body2 text-weight-regular">
            <span v-for="(cover, index) in armor.covers" :key="cover">
              {{ cover }}
              <span v-if="index < armor.covers.length - 1">, </span></span
            >
          </span>
        </p>
        <p
          class="text-subtitle1 text-weight-bold"
          v-if="armor.specifically_covers"
        >
          {{ $t('label.specifically_covers') }}:
          <span class="text-body2 text-weight-regular">
            <span
              v-for="(cover, index) in armor.specifically_covers"
              :key="cover"
            >
              {{ cover }}
              <span v-if="index < armor.specifically_covers.length - 1"
                >,
              </span></span
            >
          </span>
        </p>
        <p class="text-subtitle1 text-weight-bold" v-if="armor.material">
          {{ $t('label.material') }}:
          <span class="text-body2 text-weight-regular">
            <span v-for="(cover, index) in armor.material" :key="cover">
              {{ cover }}
              <span v-if="index < armor.material.length - 1">, </span></span
            >
          </span>
        </p>
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { parserArmorItem } from 'src/api/CardUtil';
export default {
  name: 'ArmorCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const armorItem = ref(parserArmorItem(props.jsonItem.content));
</script>
