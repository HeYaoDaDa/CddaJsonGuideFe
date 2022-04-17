<template>
  <my-card label="label.gun" v-if="isShow">
    <my-field label="label.skill">
      <my-text :content="gunFeature.skillUse.name" />
    </my-field>

    <my-field label="label.ammo">
      <my-text :content="gunFeature.ammo" span separator=", " />
    </my-field>

    <my-field label="label.range">
      <my-text :content="gunFeature.range" />
    </my-field>

    <my-field label="label.damage">
      <my-text :content="gunFeature.damage" v-slot:default="{ item }">
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

    <my-field label="label.modLocations">
      <my-text
        :content="gunFeature.validModLocations"
        v-slot:default="{ item }"
      >
        <my-text :content="item[0]" span />
        <my-text :content="` (${item[1]})`" span />
      </my-text>
    </my-field>

    <my-field label="label.modes">
      <my-text :content="gunFeature.modes" v-slot:default="{ item }">
        <my-text :content="item[1]" span />
        <my-text :content="` (${item[2]})`" span />
      </my-text>
    </my-field>

    <my-field label="label.dispersion">
      <my-text :content="gunFeature.dispersion" />
    </my-field>

    <my-field label="label.sightDispersion">
      <my-text :content="gunFeature.sightDispersion" />
    </my-field>

    <my-field label="label.recoil">
      <my-text :content="gunFeature.recoil" />
    </my-field>

    <my-field label="label.handling">
      <my-text :content="gunFeature.handling" />
    </my-field>

    <my-field label="label.durability">
      <my-text :content="gunFeature.durability" />
    </my-field>

    <my-field label="label.loudness">
      <my-text :content="gunFeature.loudness" />
    </my-field>

    <my-field label="label.clip">
      <my-text :content="gunFeature.clip" />
    </my-field>

    <my-field label="label.reloadTime">
      <my-text :content="gunFeature.reloadTime" />
    </my-field>

    <my-field label="label.reloadNoise">
      <my-text :content="gunFeature.reloadNoise" />
    </my-field>

    <my-field label="label.reloadNoiseVolume">
      <my-text :content="gunFeature.reloadNoiseVolume" />
    </my-field>

    <my-field label="label.barrelVolume">
      <my-text :content="gunFeature.barrelVolume" />
    </my-field>

    <my-field
      label="label.builtInMods"
      v-if="isNotEmpty(gunFeature.builtInMods)"
    >
      <my-text :content="gunFeature.builtInMods" />
    </my-field>

    <my-field
      label="label.defaultMods"
      v-if="isNotEmpty(gunFeature.defaultMods)"
    >
      <my-text :content="gunFeature.defaultMods" />
    </my-field>

    <my-field label="label.upsCharges">
      <my-text :content="gunFeature.upsCharges" />
    </my-field>

    <my-field label="label.blackpowderTolerance">
      <my-text :content="gunFeature.blackpowderTolerance" />
    </my-field>

    <my-field label="label.minCycleRecoil">
      <my-text :content="gunFeature.minCycleRecoil" />
    </my-field>

    <my-field
      label="label.ammoEffects"
      v-if="isNotEmpty(gunFeature.ammoEffects)"
    >
      <my-text :content="gunFeature.ammoEffects" />
    </my-field>

    <my-field label="label.ammoToFire">
      <my-text :content="gunFeature.ammoToFire" />
    </my-field>
  </my-card>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initGunFeature, validate } from 'src/features/type/Remote';
import MyCard from 'src/components/myComponents/MyCard.vue';
import MyField from 'src/components/myComponents/MyField.vue';
import MyText from 'src/components/myComponents/MyText/MyText.vue';
import { isNotEmpty } from 'src/utils';
export default {
  name: 'GunCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  jsonItem: JsonItem;
}>();
const isShow = validate(props.jsonItem);
let gunFeature;
if (isShow) {
  gunFeature = reactive(initGunFeature(props.jsonItem));
}
</script>
