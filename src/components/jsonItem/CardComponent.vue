<template>
  <q-card class="col q-my-sm q-mx-xs" v-if="props.jsonItem">
    <q-card-section>
      <p class="text-h6 text-weight-bold" @click="goCardList">
        {{ $t(props.label) }}
      </p>
      <template v-for="column in props.columns" :key="column">
        <card-field :jsonItem="props.jsonItem" :column="column" />
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import CardField from 'src/components/jsonItem/CardField.vue';
import { ColumnInterface } from 'src/type';

export default {
  name: 'CardComponent',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
  columns: ColumnInterface[];
  label: string;
  cardKey: string;
}>();
console.debug('rending Card props is ', props);
const $router = useRouter();

function goCardList() {
  void $router.push({
    name: 'card',
    params: { cardType: props.cardKey },
  });
}
</script>
