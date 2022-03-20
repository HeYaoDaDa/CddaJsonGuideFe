<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="reproductionCard">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.baby') }}:
        <span class="text-body2 text-weight-regular">{{
          reproductionCard.reproduction.baby_monster
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.baby_count') }}:
        <span class="text-body2 text-weight-regular">{{
          reproductionCard.reproduction.baby_count
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.baby_timer') }}:
        <span class="text-body2 text-weight-regular">{{
          reproductionCard.reproduction.baby_timer
        }}</span>
      </p>

      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.baby_flags') }}:
        <span v-for="(flag, index) in reproductionCard.baby_flags" :key="flag">
          {{ flag }}
          <span v-if="index < reproductionCard.baby_flags.length - 1">, </span>
        </span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from 'vue';
import { ReproductionCardClass } from 'src/cards/monsters/ReproductionCard';

export default {
  name: 'ReproductionCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  reproductionCard: ReproductionCardClass;
}>();
const reproductionCard = ref(props.reproductionCard);
console.debug('reproductionCard is read, value is ', reproductionCard.value);
</script>
