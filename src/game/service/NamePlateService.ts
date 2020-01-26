import { Vector2 } from 'three';
import { IGameService } from './index';
import { ObjectFactory } from '../ObjectFactory';
import { Universe } from '../universe/Universe';
import { PlanetNamePlate } from '../ui/name/PlanetNamePlate';
import { Planet } from '../object/Planet';
import { textures } from '../data/textures';

export class NamePlateService implements IGameService {
  private readonly universe: Universe;
  private readonly objectFactory: ObjectFactory;

  private readonly planetNamePlates: Record<string, PlanetNamePlate> = {};

  constructor(universe: Universe, objectFactory: ObjectFactory) {
    this.universe = universe;
    this.objectFactory = objectFactory;
  }

  update(delta: number) {
    let { solarSystems } = this.universe;
    for (let solarSystem of solarSystems) {
      for (let planet of solarSystem.planets) {
        let namePlate = this.getPlanetNamePlate(planet);
        namePlate.update(planet);
      }
    }
  }

  getPlanetNamePlate(planet: Planet): PlanetNamePlate {
    let existingPlate = this.planetNamePlates[planet.id];
    if (existingPlate) {
      return existingPlate;
    }
    let background = this.objectFactory.createSprite(textures.buttonRed, new Vector2(0, 0), 1, 1);
    background.material.opacity = 0.5;
    let text = this.objectFactory.createText(planet.name);
    this.planetNamePlates[planet.id] = new PlanetNamePlate(background, text);
    return this.getPlanetNamePlate(planet);
  }
}
