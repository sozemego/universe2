import { Planet } from '../Planet';
import { BuildingProductionData } from './types';
import { Resource } from '../Resource';

export class Building {
  readonly id: string;
  readonly planet: Planet;
  readonly texture: string;
  readonly name: string;
  readonly production: BuildingProductionData;

  constructor(
    id: string,
    planet: Planet,
    texture: string,
    name: string,
    production: BuildingProductionData
  ) {
    this.id = id;
    this.planet = planet;
    this.texture = texture;
    this.name = name;
    this.production = production;
  }

  update(delta: number) {
    Object.keys(this.production).forEach(resource => {
      let production = this.production[resource as Resource]!;
      production.timePassed += delta;
    });
  }
}
