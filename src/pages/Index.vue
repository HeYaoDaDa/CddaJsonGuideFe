<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <q-btn label="test" @click="updateJsonItem" />
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/CompositionComponent.vue';
import { defineComponent, ref } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PageIndex',
  components: { ExampleComponent },
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    const $store = useStore();
    const $router = useRouter();
    function updateJsonItem() {
      $store.commit('currentJsonItemQuery/updateCurrentJsonItem', {
        jsonId: 'tool_rdx_charge',
        type: 'tool',
        isOriginal: 'false',
      });
      void $router.push({ name: 'itemPage', params: { isOriginal: 'false' } });
    }
    return { todos, meta, updateJsonItem };
  },
});
</script>
