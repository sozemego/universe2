import { BuildingProductionData } from './types';
import { Resource } from '../Resource';

export class Building {
  readonly id: string;
  readonly texture: string;
  readonly name: string;
  readonly description: string;
  readonly production: BuildingProductionData;
  readonly maxPopulation: number;
  population: number;

  constructor(
    id: string,
    texture: string,
    name: string,
    description: string,
    production: BuildingProductionData,
    maxPopulation: number
  ) {
    this.id = id;
    this.texture = texture;
    this.name = name;
    this.description = description;
    this.production = production;
    this.maxPopulation = maxPopulation;
    this.population = 0;
  }

  update() {
    Object.keys(this.production).forEach(resource => {
      let production = this.production[resource as Resource]!;
      production.timePassed++;
    });
  }
}
