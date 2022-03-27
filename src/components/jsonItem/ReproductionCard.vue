<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="reproductionCard">
    <q-card-section>
      <p class="text-h6 text-weight-bold" @click="goCardList">
        {{ $t('label.reproduction') }}
      </p>
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
import { getName } from 'src/utils/JsonItemUtil';
import { useRouter } from 'vue-router';
import { getJsonItemListByJsonId } from 'src/api';

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
const $router = useRouter();
const babyMonster = ref(props.reproductionCard.reproduction?.baby_monster);
const babyEgg = ref(props.reproductionCard.reproduction?.baby_egg);
console.debug('reproductionCard is read, value is ', reproductionCard.value);

if (babyMonster.value) {
  void getJsonItemListByJsonId('monster', babyMonster.value).then(
    (jsonItems) => {
      if (jsonItems && jsonItems.length > 0) {
        babyMonster.value = getName(jsonItems[0]);
      }
    }
  );
}
if (babyEgg.value) {
  void getJsonItemListByJsonId('item', babyEgg.value).then((jsonItems) => {
    if (jsonItems && jsonItems.length > 0) {
      babyEgg.value = getName(jsonItems[0]);
    }
  });
}

function goCardList() {
  void $router.push({
    name: 'card',
    params: { cardType: 'reproduction' },
  });
}
</script>
