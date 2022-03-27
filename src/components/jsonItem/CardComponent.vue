<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="props.jsonItem">
    <q-card-section>
      <router-link
        class="text-h6 text-weight-bold"
        :to="{
          name: 'feature',
          params: { feature: props.cardKey },
        }"
        >{{ $t(label) }}</router-link
      >
      <template v-for="column in columns" :key="column">
        <card-field :jsonItem="props.jsonItem" :column="column" />
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import CardField from 'src/components/jsonItem/CardField.vue';
import { FeatureHandlerInterface } from 'src/type';
import { ref } from 'vue';

export default {
  name: 'CardComponent',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
  featureHandler: FeatureHandlerInterface;
  cardKey: string;
}>();
console.debug('rending Card props is ', props.jsonItem);
const columns = ref(props.featureHandler.getColumns());
const label = ref(props.featureHandler.label);
props.featureHandler.initJsonItemFeature(props.jsonItem);
</script>
