<template>
  <q-input
    dark
    dense
    standout
    v-model="content"
    class="q-ml-md"
    @keyup.enter.exact="search"
  >
    <template v-slot:prepend>
      <q-icon
        v-if="content != ''"
        name="clear"
        class="cursor-pointer"
        @click="content = ''"
      />
    </template>
    <template v-slot:append>
      <q-icon name="search" @click="search" />
    </template>
  </q-input>
</template>

<script lang="ts">
export default {
  name: 'SearchInput',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { showAjaxFailNotify } from 'src/api';
import { useRouter } from 'vue-router';
const content = ref('');
const $router = useRouter();

function search() {
  $router
    .push({ name: 'search', query: { content: content.value } })
    .catch(() => showAjaxFailNotify());
}
</script>
