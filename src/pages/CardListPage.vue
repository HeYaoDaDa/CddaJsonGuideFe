<template>
  <q-page v-if="isShow" class="row justify-around content-start">
    <q-table
      class="col-12"
      :title="$t(tableData.label)"
      :rows="tableData.data"
      :columns="tableData.columns"
      @row-click="rowClick"
      row-key="_id"
      :rows-per-page-options="[15, 30, 50, 100, 0]"
    />
  </q-page>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cardTypes } from 'src/constant';
import { TableInterfact } from 'src/cards/CardInterface';
import { Loading } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ReproductionCardClass } from 'src/cards/monsters/ReproductionCard';
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
const cardClass = cardTypes.get($route.params.cardType as string);
const isShow = ref(false);
const tableData = ref({} as TableInterfact);
const i18n = useI18n();

function updateCardListPage() {
  isShow.value = false;
  Loading.show();
  if (cardClass) {
    void cardClass.getTable().then((tableInterfact) => {
      transferLabel(tableInterfact);
      tableInterfact.data.forEach((jsonItem) =>
        transStrings((<ReproductionCardClass>jsonItem.content).baby_flags)
      );
      tableData.value = tableInterfact;
      isShow.value = true;
      Loading.hide();
    });
  }
}

updateCardListPage();

function transferLabel(tableData: TableInterfact) {
  const columns = tableData.columns as { label: string }[];
  columns.forEach((column) => (column.label = i18n.t(column.label)));
}

function transStrings(datas: string[] | undefined) {
  if (datas) {
    datas.forEach((value, key) => (datas[key] = i18n.t(value.toLowerCase())));
  }
}

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
