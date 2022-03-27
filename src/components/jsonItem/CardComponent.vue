<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="props.jsonItem">
    <q-card-section>
      <p class="text-h6 text-weight-bold" @click="goCardList">
        {{ $t(label) }}
      </p>
      <template v-for="column in columns" :key="column">
        <card-field
          :jsonItem="props.jsonItem"
          :column="column"
          :feature="props.featureHandler.convertToFeature(props.jsonItem)"
        />
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
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
  featureHandler: FeatureHandlerInterface<unknown>;
  cardKey: string;
}>();
console.debug('rending Card props is ', props);
const $router = useRouter();
const columns = ref(props.featureHandler.getColumns());
const label = ref(props.featureHandler.label);

function goCardList() {
  void $router.push({
    name: 'feature',
    params: { feature: props.cardKey },
  });
}
</script>
