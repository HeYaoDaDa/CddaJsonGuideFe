<template>
  <q-page v-if="isShow" class="row justify-around content-start">
    <q-table
      class="col-12"
      :title="title"
      :rows="datas"
      :columns="columns"
      @row-click="rowClick"
      row-key="_id"
    />
  </q-page>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { featureFactorys } from 'src/features';
import { Loading } from 'quasar';
import { useStore } from 'src/store';
import { getJsonItemsByItemType } from 'src/api';
import { QualitiesFeature } from 'src/features/type/item/Qualities';
import { ColumnInterface } from 'src/type';
import { getModName, getName } from 'src/utils/JsonItemUtil';
import { useI18n } from 'vue-i18n';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';

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
const featureHandler = featureFactorys
  .find((featureFactory) => featureFactory.featureKey === $route.params.feature)
  ?.getFeatureHandler();
const title = ref('' as string | undefined);
const columns = ref([{} as ColumnInterface]);
const isShow = ref(false);
const datas = ref(new Array<unknown>());
const i18n = useI18n();

function updateCardListPage() {
  isShow.value = false;
  Loading.show();
  if (featureHandler) {
    title.value = i18n.t(featureHandler.label);
    columns.value = featureHandler.getColumns();
    void featureHandler.getDatas().then((jsonItems) => {
      datas.value = jsonItems;
      isShow.value = true;
      Loading.hide();
    });
  } else if (
    $route.params.feature === 'qualities' &&
    $route.params.sub.length > 0
  ) {
    const qualitieKey =
      typeof $route.params.sub === 'string'
        ? $route.params.sub
        : $route.params.sub.toString();
    void getBaseJsonItem('tool_quality', qualitieKey).then((jsonItem) => {
      if (jsonItem) {
        title.value = getName(jsonItem);
      }
    });
    (columns.value = [
      {
        name: 'name',
        label: i18n.t('label.name'),
        field: (row: JsonItem) => getName(row),
        required: true,
        sortable: true,
        hideInCard: true,
      },
      {
        name: 'mod',
        label: 'Mod',
        field: (row: JsonItem) => getModName(row.mod),
        required: true,
        sortable: true,
        hideInCard: true,
      },
      {
        name: 'level',
        label: i18n.t('label.level'),
        field: (row: JsonItem) =>
          new QualitiesFeature(row).qualities.find(
            (qualitie) => qualitie[0] === qualitieKey
          )?.[1],
        required: true,
        sortable: true,
      },
    ]),
      void getJsonItemsByItemType('item', [
        {
          $match: {
            'content.qualities': {
              $exists: true,
            },
          },
        },
      ]).then((jsonItems) => {
        datas.value = jsonItems.filter((jsonItem) =>
          new QualitiesFeature(jsonItem).qualities.find(
            (qualitie) => qualitie[0] === $route.params.sub
          )
        );
        isShow.value = true;
        Loading.hide();
      });
  } else {
    console.error('CardListPage no find featureHandler');
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
