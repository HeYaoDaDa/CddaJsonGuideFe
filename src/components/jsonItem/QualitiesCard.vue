<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.qualities') }}:
      </p>
      <p
        class="text-body2 text-weight-regular"
        v-for="(qualitie, index) in qualitiesFeature.qualities"
        :key="qualitie"
      >
        <router-link
          class="text-body2 text-weight-regular"
          :to="{
            name: 'feature',
            params: { feature: 'qualities', sub: qualitie.id },
          }"
          >{{ qualitiesFeature.getName(index) }}</router-link
        >
        :{{ qualitie.level }}
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
const qualitiesFeature = ref(new QualitiesFeature(props.jsonItem));
</script>
