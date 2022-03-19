<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="attackItem">
    <q-card-section>
      <p
        class="text-subtitle1 text-weight-bold"
        v-if="attackItem.weapon_category"
      >
        {{ $t('label.weapon_categories_required') }}:
        <span class="text-body2 text-weight-regular">{{
          attackItem.weapon_category
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.bash') }}:
        <span class="text-body2 text-weight-regular">{{
          attackItem.bashing
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.cut') }}:
        <span class="text-body2 text-weight-regular">{{
          attackItem.cutting
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.stab') }}:
        <span class="text-body2 text-weight-regular">{{
          attackItem.piercing
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.to_hit') }}:
        <span class="text-body2 text-weight-regular">{{
          attackItem.to_hit
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.base_moves_per_attack') }}:
        <span class="text-body2 text-weight-regular">{{
          attackItem.baseMovesPerAttack
        }}</span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from 'vue';
import { parserAttackItem } from 'src/utils/CardUtil';
export default {
  name: 'AttackCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const attackItem = ref(parserAttackItem(props.jsonItem));
</script>
