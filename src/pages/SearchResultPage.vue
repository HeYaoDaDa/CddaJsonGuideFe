<template>
  <q-page class="row justify-around content-start" v-if="isShow">
    <q-card
      v-for="searchResultItem in searchResultItems"
      :key="searchResultItem"
      class="col-6"
    >
      <router-link
        :to="{
          name: 'jsonItem',
          params: {
            jsonType: searchResultItem.type,
            jsonId: searchResultItem.jsonId,
          },
        }"
      >
        {{ searchResultItem.name }}
      </router-link>
      <q-badge>{{ getModName(searchResultItem.mod) }}</q-badge>
    </q-card>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'SearchResultPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { Loading } from 'quasar';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useStore } from 'src/store';
import { showAjaxFailNotify } from 'src/utils';
import { getModName } from 'src/utils/JsonItemUtil';

const searchResultItems = ref([] as SearchResultItem[]);
const isShow = ref(false);
const $store = useStore();
const config = $store.state.userConfig;
const route = useRoute();

function updateSearchResultItems(newroute: typeof route) {
  isShow.value = false;
  Loading.show();
  // searchItem(
  //   newroute.query.content as string,
  //   newroute.query.category as string
  // )
  //   .then((newSearchItems) => {
  //     searchResultItems.value = newSearchItems;
  //     Loading.hide();
  //     isShow.value = true;
  //   })
  //   .catch(() => showAjaxFailNotify());
}

updateSearchResultItems(route);

onBeforeRouteUpdate((to, from) => {
  if (to.query !== from.query) {
    updateSearchResultItems(to);
  }
});

watch(
  computed({
    get: () => [config.language, config.version, config.mods],
    set: () => console.error('Cannot modify!!!'),
  }),
  () => updateSearchResultItems(route)
);
</script>
