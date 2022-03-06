<template>
  <q-select
    filled
    v-model="selectedMods"
    :options="options"
    :label="$t('lable.mods')"
    multiple
    emit-value
    map-options
  >
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label v-html="opt.label"></q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :modelValue="selected"
            @update:modelValue="toggleOption(opt)"
          />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModsSelect',
  inject: ['selectedMods'],
  data() {
    return {
      model: [],
      options: [
        {
          label: 'Cycalysm dda',
          value: 'dda',
        },
        {
          label: 'test',
          value: 'test2',
        },
        {
          label: 'sadvsdafgadsf',
          value: 'dsf',
        },
        {
          label: 'No hope',
          value: 'no_hope',
        },
        {
          label: 'innawood',
          value: 'innawood',
        },
      ],
    };
  },
});
</script>
