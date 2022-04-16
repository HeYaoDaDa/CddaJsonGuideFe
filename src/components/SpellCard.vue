<template>
  <my-card
    label="label.spell"
    v-if="isShow"
    :route="{
      name: 'jsonItem',
      params: {
        jsonType: 'spell',
        jsonId: props.jsonItem.jsonId,
      },
    }"
  >
    <my-field label="label.class">
      <my-text
        v-if="spellFeature.class.id == 'none'"
        :content="spellFeature.class.name"
      />
      <my-text
        v-else
        :content="spellFeature.class.name"
        :route="{
          name: 'jsonItem',
          params: {
            jsonType: 'mutation',
            jsonId: spellFeature.class.id,
          },
        }"
      />
    </my-field>

    <my-field label="label.spellDiffculty">
      <my-text :content="spellFeature.diffculty" />
    </my-field>

    <my-field label="label.shape">
      <my-text :content="spellFeature.shape.name" />
    </my-field>

    <my-field label="label.maxLevel">
      <my-text :content="spellFeature.maxLevel" />
    </my-field>

    <my-field label="label.baseCastingTime">
      <my-text :content="spellFeature.baseCastingTime" />
    </my-field>

    <my-field label="label.spellCost">
      <my-text :content="spellFeature.baseEnergyCost" span />
      <my-text :content="' ' + spellFeature.energySource.name" span />
    </my-field>

    <my-field label="label.require">
      <my-text :content="spellFeature.require" separator=", " span />
    </my-field>

    <my-field label="label.affectedBodyParts">
      <my-text
        :content="spellFeature.affectedBodyParts.map((item) => item.name)"
        :route="
          spellFeature.affectedBodyParts.map((item) => {
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

    <my-field label="label.validTargets">
      <my-text
        :content="spellFeature.validTargets.map((item) => item.name)"
        separator=", "
        span
      />
    </my-field>

    <my-field label="label.damage" dl>
      <my-field label="label.type">
        <my-text :content="spellFeature.damageType.name" />
      </my-field>
      <my-field label="label.min">
        <my-text :content="spellFeature.minDamage" />
      </my-field>
      <my-field label="label.max">
        <my-text :content="spellFeature.maxDamage" />
      </my-field>
      <my-field label="label.increment">
        <my-text :content="spellFeature.damageIncrement" />
      </my-field>
    </my-field>

    <my-field label="label.range" dl>
      <my-field label="label.min">
        <my-text :content="spellFeature.minRange" />
      </my-field>
      <my-field label="label.max">
        <my-text :content="spellFeature.maxRange" />
      </my-field>
      <my-field label="label.increment">
        <my-text :content="spellFeature.rangeIncrement" />
      </my-field>
    </my-field>

    <my-field label="label.radius" dl>
      <my-field label="label.min">
        <my-text :content="spellFeature.minAoe" />
      </my-field>
      <my-field label="label.max">
        <my-text :content="spellFeature.maxAoe" />
      </my-field>
      <my-field label="label.increment">
        <my-text :content="spellFeature.aoeIncrement" />
      </my-field>
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initSpellFeature, validate } from 'src/features/type/other/Spell';
import MyCard from './myComponents/MyCard.vue';
import MyField from './myComponents/MyField.vue';
import MyText from './myComponents/MyText/MyText.vue';
export default {
  name: 'SpellCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = validate(props.jsonItem);
let spellFeature;
if (isShow) {
  spellFeature = reactive(initSpellFeature(props.jsonItem));
}
</script>
