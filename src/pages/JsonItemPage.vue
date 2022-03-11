<template>
  <q-page v-if="show" class="row justify-around content-start">
    <all-card :jsonItem="jsonItem" />
    <general-card :jsonItem="jsonItem" />
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'JsonItemPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { updateJsonItem } from 'src/api';
import { ref } from 'vue';
import AllCard from 'src/components/jsonItem/AllCard.vue';
import { Loading } from 'quasar';
import { useRoute } from 'vue-router';
import GeneralCard from 'src/components/jsonItem/GeneralCard.vue';

const $router = useRoute();
const jsonItem = ref({} as JsonItem);
const show = ref(false);

Loading.show();

updateJsonItem(
  jsonItem,
  $router.params.jsonType as string,
  $router.params.jsonId as string,
  function () {
    Loading.hide();
    show.value = true;
  }
);
</script>
