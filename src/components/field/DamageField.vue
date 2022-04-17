<template>
  <my-field label="label.damage" v-if="isNotEmpty(damages)">
    <my-text :content="damages" v-slot:default="{ item }">
      <dl>
        <my-field label="label.type">
          <my-text :content="$t('damageType.' + item.damageType)" />
        </my-field>
        <my-field label="label.damage">
          <my-text :content="item.amount" />
        </my-field>
        <my-field label="label.armorPenetration" v-if="item.armorPenetration">
          <my-text :content="item.armorPenetration" />
        </my-field>
        <my-field
          label="label.armorMultiplier"
          v-if="item.armorPenetrationMultiplier"
        >
          <my-text :content="item.armorPenetrationMultiplier" />
        </my-field>
        <my-field label="label.damageMultiplier" v-if="item.damageMultiplier">
          <my-text :content="item.damageMultiplier" />
        </my-field>
      </dl>
    </my-text>
  </my-field>
</template>

<script lang="ts">
import { reactive } from 'vue';
import MyField from 'src/components/myComponents/MyField.vue';
import MyText from 'src/components/myComponents/MyText/MyText.vue';
import { isNotEmpty } from 'src/utils';
import { DamageInstance } from 'src/features/type/other/Damage';
export default {
  name: 'DamageField',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  damage: DamageInstance | DamageInstance[];
}>();
const damages = reactive(
  props.damage instanceof Array ? props.damage : [props.damage]
);
</script>
