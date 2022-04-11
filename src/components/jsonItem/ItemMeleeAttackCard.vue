<template>
  <my-card label="label.attack" v-if="isShow">
    <my-field label="label.weapon_categories_required">
      <my-text
        :content="itemMeleeAttackFeature.weapon_category"
        v-slot:default="{ item }"
      >
        <my-text
          :content="item.name"
          :route="{
            name: 'jsonItem',
            params: {
              jsonType: 'weapon_category',
              jsonId: item.id,
            },
          }"
        />
      </my-text>
    </my-field>

    <my-field label="label.bash">
      <my-text :content="itemMeleeAttackFeature.bashing" />
    </my-field>

    <my-field label="label.cut">
      <my-text :content="itemMeleeAttackFeature.cutting" />
    </my-field>

    <my-field label="label.stab">
      <my-text :content="itemMeleeAttackFeature.piercing" />
    </my-field>
    <my-field label="label.to_hit">
      <my-text :content="itemMeleeAttackFeature.to_hit" />
    </my-field>

    <my-field label="label.base_moves_per_attack">
      <my-text :content="itemMeleeAttackFeature.baseMovesPerAttack" />
    </my-field>

    <my-field label="label.technique">
      <my-text
        :content="itemMeleeAttackFeature.techniques"
        v-slot:default="{ item }"
      >
        <my-text
          :content="item.name"
          :route="{
            name: 'jsonItem',
            params: {
              jsonType: 'technique',
              jsonId: item.id,
            },
          }"
          span
        />
        <my-text :content="': ' + item.des" span />
      </my-text>
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from '@vue/reactivity';
import MyCard from '../myComponents/MyCard.vue';
import MyField from '../myComponents/MyField.vue';
import MyText from '../myComponents/MyText/MyText.vue';
import {
  validate,
  initItemMeleeAttackFeature,
} from 'src/features/type/item/ItemMeleeAttack';
import { ref } from 'vue';
export default {
  name: 'ItemMeleeAttackCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = ref(validate(props.jsonItem));
const itemMeleeAttackFeature = reactive(
  initItemMeleeAttackFeature(props.jsonItem)
);
</script>
