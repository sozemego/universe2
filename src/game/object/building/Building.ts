import { BuildingProductionData } from './types';
import { Resource } from '../Resource';

export class Building {
  readonly id: string;
  readonly texture: string;
  readonly name: string;
  readonly production: BuildingProductionData;
  readonly populationNeeded: number;
  population: number = 0;

  constructor(
    id: string,
    texture: string,
    name: string,
    production: BuildingProductionData,
    populationNeeded: number
  ) {
    this.id = id;
    this.texture = texture;
    this.name = name;
    this.production = production;
    this.populationNeeded = populationNeeded;
  }

  update(delta: number) {
    Object.keys(this.production).forEach(resource => {
      let production = this.production[resource as Resource]!;
      production.timePassed += delta * (this.population / this.populationNeeded);
    });
  }
}
