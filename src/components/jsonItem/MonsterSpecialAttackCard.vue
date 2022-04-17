<template>
  <my-card label="label.monsterSpecialAttackFeature" v-if="isShow">
    <my-field label="label.cooldown">
      <my-text :content="monsterSpecialAttackFeature.cooldown" />
    </my-field>

    <damage-field :damage="monsterSpecialAttackFeature.damageMaxInstance" />

    <my-field label="label.min" v-if="monsterSpecialAttackFeature.minMul">
      <my-text :content="monsterSpecialAttackFeature.minMul" />
    </my-field>

    <my-field label="label.max" v-if="monsterSpecialAttackFeature.maxMul">
      <my-text :content="monsterSpecialAttackFeature.maxMul" />
    </my-field>

    <monster-attack-effect-field
      :effect="monsterSpecialAttackFeature.effects"
    />

    <my-field label="label.moveCost">
      <my-text :content="monsterSpecialAttackFeature.moveCost" />
    </my-field>

    <my-field
      label="label.accuracy"
      v-if="monsterSpecialAttackFeature.accuracy"
    >
      <my-text :content="monsterSpecialAttackFeature.accuracy" />
    </my-field>

    <my-field
      label="label.chance"
      v-if="monsterSpecialAttackFeature.attackChance"
    >
      <my-text :content="monsterSpecialAttackFeature.attackChance" />
    </my-field>

    <my-field label="label.range" v-if="monsterSpecialAttackFeature.range">
      <my-text :content="monsterSpecialAttackFeature.range" />
    </my-field>

    <my-field
      label="label.bodyPart"
      v-if="monsterSpecialAttackFeature.bodyParts"
    >
      <my-text
        :content="
          monsterSpecialAttackFeature.bodyParts.map((item) => item.name)
        "
        :route="
          monsterSpecialAttackFeature.bodyParts.map((item) => {
            return {
              name: 'jsonItem',
              params: {
                jsonType: 'body_part',
                jsonId: item.id,
              },
            };
          })
        "
        separator=", "
        span
      />
    </my-field>

    <my-field label="label.attackUpper">
      <my-text :content="monsterSpecialAttackFeature.attackUpper" />
    </my-field>

    <my-field
      label="label.hitsizeMin"
      v-if="monsterSpecialAttackFeature.hitsizeMin"
    >
      <my-text :content="monsterSpecialAttackFeature.hitsizeMin" />
    </my-field>

    <my-field
      label="label.hitsizeMax"
      v-if="monsterSpecialAttackFeature.hitsizeMax"
    >
      <my-text :content="monsterSpecialAttackFeature.hitsizeMax" />
    </my-field>

    <my-field label="label.noAdjacent">
      <my-text :content="monsterSpecialAttackFeature.noAdjacent" />
    </my-field>

    <my-field
      label="label.throwStrength"
      v-if="monsterSpecialAttackFeature.throwStrength"
    >
      <my-text :content="monsterSpecialAttackFeature.throwStrength" />
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import {
  initMonsterSpecialAttackFeature,
  validate,
} from 'src/features/type/monster/MonsterSpecialAttack';
import MyCard from 'src/components/myComponents/MyCard.vue';
import MyField from 'src/components/myComponents/MyField.vue';
import MyText from 'src/components/myComponents/MyText/MyText.vue';
import DamageField from '../field/DamageField.vue';
import MonsterAttackEffectField from '../field/MonsterAttackEffectField.vue';

export default {
  name: 'MonsterSpecialAttackCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = validate(props.jsonItem);
let monsterSpecialAttackFeature;
if (isShow) {
  monsterSpecialAttackFeature = reactive(
    initMonsterSpecialAttackFeature(props.jsonItem)
  );
}
</script>
