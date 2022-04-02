<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.qualities') }}:
      </p>
      <p
        class="text-body2 text-weight-regular"
        v-for="qualitie in qualities"
        :key="qualitie"
      >
        {{ qualitie[0] }}:{{ qualitie[1] }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  QualitiesContent,
  QualitiesFeature,
} from 'src/features/type/item/Qualities';
import { ref } from 'vue';
export default {
  name: 'QualitiesCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = ref(
  (<QualitiesContent>props.jsonItem.content).qualities != undefined
);
const qualities = ref(new QualitiesFeature(props.jsonItem).qualities);
</script>
