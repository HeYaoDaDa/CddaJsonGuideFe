<template>
  <my-card label="label.material" v-if="isShow">
    <my-field label="label.resistance" dl>
      <my-field label="label.bash">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.bash_resist }}
        </p>
      </my-field>
      <my-field label="label.cut">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.cut_resist }}
        </p>
      </my-field>
      <my-field label="label.bullet">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.bullet_resist }}
        </p>
      </my-field>
      <my-field label="label.acid">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.acid_resist }}
        </p>
      </my-field>
      <my-field label="label.electricity">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.elec_resist }}
        </p>
      </my-field>
      <my-field label="label.fire">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.fire_resist }}
        </p>
      </my-field>
      <my-field label="label.chip">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.chip_resist }}
        </p>
      </my-field>
    </my-field>
    <my-field label="label.density">
      <p class="text-body2 text-weight-regular">
        {{ materialFeature.density }}
      </p>
    </my-field>
    <my-field label="label.latentHeat">
      <p class="text-body2 text-weight-regular">
        {{ materialFeature.latent_heat }}
      </p>
    </my-field>
    <my-field label="label.edible">
      <p class="text-body2 text-weight-regular">
        {{ materialFeature.edible }}
      </p>
    </my-field>
    <my-field label="label.rotting">
      <p class="text-body2 text-weight-regular">
        {{ materialFeature.rotting }}
      </p>
    </my-field>
    <my-field label="label.specificHeat" dl>
      <my-field label="label.liquid">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.specific_heat_liquid }}
        </p>
      </my-field>
      <my-field label="label.solid">
        <p class="text-body2 text-weight-regular">
          {{ materialFeature.specific_heat_solid }}
        </p>
      </my-field>
    </my-field>
  </my-card>
</template>

<script lang="ts">
import MyCard from '../myComponents/MyCard.vue';
import MyField from '../myComponents/MyField.vue';
import { computed, reactive } from 'vue';
import { MaterialFeature } from 'src/features/type/other/material';
import { changeOnlyReadlyComputed } from 'src/constant/LogConstant';
export default {
  name: 'MaterialCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = computed({
  get: () => MaterialFeature.isShow(props.jsonItem),
  set: () => {
    console.error(changeOnlyReadlyComputed);
  },
});
const materialFeature = reactive(new MaterialFeature(props.jsonItem));
</script>
