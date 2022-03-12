<template>
  <q-card class="col-12 q-my-sm q-mx-xs" v-if="isShow">
    <q-card-section>
      <q-expansion-item label="JSON">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="proceed" label="处理过的" />
            <q-tab name="original" label="原版" @click="getOriginalJson" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="proceed">
              <pre>{{ json }}</pre>
            </q-tab-panel>
            <q-tab-panel name="original">
              <q-spinner v-if="spinnerShow" />
              <pre v-else>{{ originalJson }}</pre>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref } from 'vue';
import { getJsonItem, showAjaxFailNotify } from 'src/api';
export default {
  name: 'JsonCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const tab = ref('proceed');
const json = ref(JSON.stringify(props.jsonItem.content, null, 4));
const isShow = json.value != undefined;
const originalJson = ref('');
const spinnerShow = ref(false);
function getOriginalJson() {
  if (originalJson.value.length == 0) {
    spinnerShow.value = true;
    getJsonItem(props.jsonItem.type, props.jsonItem.jsonId, true)
      .then((newJsonItem) => {
        originalJson.value = JSON.stringify(newJsonItem.content, null, 4);
        spinnerShow.value = false;
      })
      .catch(() => showAjaxFailNotify());
  }
}
</script>
