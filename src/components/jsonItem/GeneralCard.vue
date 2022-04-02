<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="generalItem">
    <q-card-section>
      <p
        class="text-subtitle1 text-weight-bold"
        v-if="generalItem.materials.length > 0"
      >
        {{ $t('label.materials') }}:
        <span class="text-body2 text-weight-regular">
          <span
            v-for="(material, index) in generalItem.materials"
            :key="material"
          >
            {{ material }}
            <span v-if="index < generalItem.materials.length - 1"
              >,
            </span></span
          >
        </span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="generalItem.volume">
        {{ $t('label.volume') }}:
        <span class="text-body2 text-weight-regular">{{
          generalItem.volume
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="generalItem.weight">
        {{ $t('label.weight') }}:
        <span class="text-body2 text-weight-regular">{{
          generalItem.weight
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold">
        {{ $t('label.length') }}:
        <span class="text-body2 text-weight-regular">{{
          generalItem.length
        }}</span>
      </p>
      <p class="text-subtitle1 text-weight-bold" v-if="generalItem.category">
        {{ $t('label.category') }}:
        <span class="text-body2 text-weight-regular">{{
          generalItem.category
        }}</span>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { GeneralFeature } from 'src/features/type/item/General';
export default {
  name: 'GeneralCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const generalItem = ref(new GeneralFeature(props.jsonItem));
</script>
