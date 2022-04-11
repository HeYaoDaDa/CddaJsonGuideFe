<template>
  <my-card label="label.attack" v-if="isShow">
    <my-field label="label.weapon_categories_required">
      <ul>
        <li
          v-for="weaponCategory in itemMeleeAttackFeature.weapon_category"
          :key="weaponCategory.id"
        >
          <my-text
            :content="weaponCategory.name"
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'weapon_category',
                jsonId: weaponCategory.id,
              },
            }"
          />
        </li>
      </ul>
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
      <ul>
        <li
          v-for="technique in itemMeleeAttackFeature.techniques"
          :key="technique.id"
        >
          <my-text
            :content="technique.name"
            :route="{
              name: 'jsonItem',
              params: {
                jsonType: 'technique',
                jsonId: technique.id,
              },
            }"
            span
          />
          <my-text :content="': ' + technique.des" span />
        </li>
      </ul>
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
