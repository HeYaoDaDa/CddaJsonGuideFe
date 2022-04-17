<template>
  <my-field label="label.effect" v-if="isNotEmpty(effects)">
    <my-text :content="effects" v-slot:default="{ item }">
      <dl>
        <my-field label="label.name">
          <my-text
            :content="item.name"
            :route="{
              name: 'jsonItem',
              params: { jsonType: 'effect_type', jsonId: item.id },
            }"
          />
        </my-field>
        <my-field label="label.duration" v-if="item.duration">
          <my-text :content="item.duration" />
        </my-field>
        <my-field
          label="label.affect_hit_bp"
          v-if="item.affect_hit_bp !== undefined"
        >
          <my-text :content="item.affect_hit_bp" />
        </my-field>
        <my-field label="label.bodyPart" v-if="item.bp">
          <my-text :content="item.bp.name" />
        </my-field>
        <my-field label="label.permanent" v-if="item.permanent !== undefined">
          <my-text :content="item.permanent" />
        </my-field>
        <my-field label="label.chance" v-if="item.chance">
          <my-text :content="item.chance" />
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
import { MonsterAttackEffectFeature } from 'src/features/type/other/MonsterAttackEffect';
export default {
  name: 'MonsterAttackEffectField',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  effect: MonsterAttackEffectFeature | MonsterAttackEffectFeature[];
}>();
const effects = reactive(
  props.effect instanceof Array ? props.effect : [props.effect]
);
</script>
