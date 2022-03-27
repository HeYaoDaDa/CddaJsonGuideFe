<template>
  <q-page v-if="isShow" class="row justify-around content-start">
    <q-table
      class="col-12"
      :title="$t(cardClass.label)"
      :rows="datas"
      :columns="cardClass.getColumns()"
      @row-click="rowClick"
      row-key="_id"
      :rows-per-page-options="[15, 30, 50, 100, 0]"
    />
  </q-page>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { featureFactorys } from 'src/features';
import { Loading } from 'quasar';
import { useStore } from 'src/store';

export default {
  name: 'CardListPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const $store = useStore();
const config = $store.state.userConfig;
const $route = useRoute();
const $router = useRouter();
const featureFactory = featureFactorys
  .get($route.params.cardType as string)
  ?.getFeatureHandler();
const isShow = ref(false);
const datas = ref(new Array<unknown>());

function updateCardListPage() {
  isShow.value = false;
  Loading.show();
  if (featureFactory) {
    void featureFactory.getDatas().then((jsonItems) => {
      datas.value = jsonItems;
      isShow.value = true;
      Loading.hide();
    });
  }
}

updateCardListPage();

function rowClick(evt: object, row: JsonItem): void {
  void $router.push({
    name: 'jsonItem',
    params: { jsonType: row.type, jsonId: row.jsonId },
  });
}

watch(
  computed({
    get: () => [config.language, config.version, config.mods],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => {
    console.debug('JsonItemPage config update');
    updateCardListPage();
  }
);
</script>
