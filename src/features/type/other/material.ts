interface MaterialContent {
  density: number;
  specific_heat_liquid?: number;
  specific_heat_solid?: number;
  latent_heat?: number;
  edible?: boolean;
  rotting?: boolean;
  bash_resist: number;
  cut_resist: number;
  bullet_resist: number;
  acid_resist: number;
  elec_resist: number;
  fire_resist: number;
  chip_resist: number;
}

export class MaterialFeature {
  density: number;
  specific_heat_liquid: number;
  specific_heat_solid: number;
  latent_heat: number;
  edible: boolean;
  rotting: boolean;
  bash_resist: number;
  cut_resist: number;
  bullet_resist: number;
  acid_resist: number;
  elec_resist: number;
  fire_resist: number;
  chip_resist: number;

  constructor(jsonItem: JsonItem) {
    const materialContent = jsonItem.content as MaterialContent;
    this.density = materialContent.density;
    this.specific_heat_liquid = materialContent.specific_heat_liquid ?? 4.186;
    this.specific_heat_solid = materialContent.specific_heat_solid ?? 2.108;
    this.latent_heat = materialContent.latent_heat ?? 334;
    this.edible = materialContent.edible ?? false;
    this.rotting = materialContent.rotting ?? false;
    this.bash_resist = materialContent.bash_resist;
    this.cut_resist = materialContent.cut_resist;
    this.bullet_resist = materialContent.bullet_resist;
    this.acid_resist = materialContent.acid_resist;
    this.elec_resist = materialContent.elec_resist;
    this.fire_resist = materialContent.fire_resist;
    this.chip_resist = materialContent.chip_resist;
  }

  static isShow(jsonItem: JsonItem) {
    return jsonItem.type === 'material';
  }
}
