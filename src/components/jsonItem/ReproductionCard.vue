<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="reproductionCard">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold" v-if="babyMonster">
        {{ $t('label.baby_monster') }}:
        <span class="text-body2 text-weight-regular">{{ babyMonster }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="babyEgg">
        {{ $t('label.baby_egg') }}:
        <span class="text-body2 text-weight-regular">{{ babyEgg }}</span>
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
import { getJsonItem } from 'src/api/jsonItem';
import { getName } from 'src/utils/JsonItemUtil';

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

const babyMonster = ref(props.reproductionCard.reproduction?.baby_monster);
const babyEgg = ref(props.reproductionCard.reproduction?.baby_egg);

if (babyMonster.value) {
  void getJsonItem('monster', babyMonster.value).then((jsonItem) => {
    if (jsonItem) {
      babyMonster.value = getName(jsonItem);
    }
  });
}
if (babyEgg.value) {
  void getJsonItem('item', babyEgg.value).then((jsonItem) => {
    if (jsonItem) {
      babyEgg.value = getName(jsonItem);
    }
  });
}
</script>
