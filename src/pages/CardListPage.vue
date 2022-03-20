<template>
  <q-page v-if="isShow" class="row justify-around content-start">
    <q-table
      class="col-12"
      :title="tableData.label"
      :rows="tableData.data"
      :columns="tableData.columns"
      row-key="_id"
      :rows-per-page-options="[10, 30, 50, 100, 0]"
    />
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { cardTypes } from 'src/constant';
import { TableInterfact } from 'src/cards/CardInterface';
import { Loading } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ReproductionCardClass } from 'src/cards/monsters/ReproductionCard';

export default {
  name: 'CardListPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const $route = useRoute();
const cardClass = cardTypes.get($route.params.cardType as string);
const isShow = ref(false);
const tableData = ref({} as TableInterfact);
const i18n = useI18n();
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

function transferLabel(tableData: TableInterfact) {
  const columns = tableData.columns as { label: string }[];
  columns.forEach((column) => (column.label = i18n.t(column.label)));
}

function transStrings(datas: string[] | undefined) {
  if (datas) {
    datas.forEach((value, key) => (datas[key] = i18n.t(value.toLowerCase())));
  }
}
</script>
