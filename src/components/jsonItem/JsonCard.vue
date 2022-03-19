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
            <q-tab name="original" label="原版" />
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
const originalJson = ref(props.jsonItem.originalContent);
const spinnerShow = ref(false);
</script>
