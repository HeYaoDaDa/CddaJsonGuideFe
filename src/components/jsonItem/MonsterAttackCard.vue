<template>
  <my-card label="attack" v-if="isShow">
    <my-field label="label.aggression">
      <my-text :content="monsterAttackFeature.aggression" />
    </my-field>

    <my-field label="label.morale">
      <my-text :content="monsterAttackFeature.morale" />
    </my-field>

    <my-field label="label.regenMorale">
      <my-text :content="monsterAttackFeature.regenMorale" />
    </my-field>

    <my-field label="label.difficulty">
      <my-text :content="monsterAttackFeature.diff" />
    </my-field>

    <my-field label="label.attackCost">
      <my-text :content="monsterAttackFeature.attackCost" />
    </my-field>

    <my-field label="label.meleeSkill">
      <my-text :content="monsterAttackFeature.meleeSkill" />
    </my-field>

    <my-field label="label.grabStrength">
      <my-text :content="monsterAttackFeature.grabStrength" />
    </my-field>

    <my-field label="label.bashSkill" v-if="monsterAttackFeature.bashSkill">
      <my-text :content="monsterAttackFeature.bashSkill" />
    </my-field>

    <damage-field :damage="monsterAttackFeature.meleeDamage" />

    <my-field label="label.bash">
      <my-text :content="monsterAttackFeature.meleeDice" span />
      <my-text :content="'d' + monsterAttackFeature.meleeDiceSides" span />
    </my-field>

    <my-field label="label.startingAmmo" v-if="isNotEmpty(monsterAttackFeature.startingAmmo)">
      <my-text :content="monsterAttackFeature.startingAmmo" v-slot:default="{ item }" separator=", ">
        <my-text
          :content="item.name"
          :route="{
            name: 'jsonItem',
            params: {
              jsonType: 'item',
              jsonId: item.id,
            },
          }"
          span
        />
        <my-text :content="` (${item.amount})`" span />
      </my-text>
    </my-field>

    <monster-attack-effect-field :effect="monsterAttackFeature.attackEffects" />

    <my-field label="label.monsterSpecialAttackFeature" v-if="monsterAttackFeature.specialAttacks">
      <my-text :content="monsterAttackFeature.specialAttacks" v-slot:default="{ item }">
        <dl>
          <my-field label="label.type">
            <my-text :content="item.type" />
          </my-field>
          <my-field label="label.name" v-if="item.id">
            <my-text :content="item.id" />
          </my-field>
          <my-field label="label.cooldown" v-if="item.cooldown">
            <my-text :content="item.cooldown" />
          </my-field>
        </dl>
      </my-text>
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initMonsterAttackFeature, validate } from 'src/features/type/monster/MonsterAttack';
import MyCard from 'src/components/myComponents/MyCard.vue';
import MyField from 'src/components/myComponents/MyField.vue';
import MyText from 'src/components/myComponents/MyText/MyText.vue';
import DamageField from 'src/components/field/DamageField.vue';
import { isNotEmpty } from 'src/utils';
import MonsterAttackEffectField from 'src/components/field/MonsterAttackEffectField.vue';
export default {
  components: { MonsterAttackEffectField },
  name: 'MonsterAttackCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = validate(props.jsonItem);
let monsterAttackFeature;
if (isShow) {
  monsterAttackFeature = reactive(initMonsterAttackFeature(props.jsonItem));
}
</script>
