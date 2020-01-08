import { IGameService } from './index';
import { Universe } from '../universe/Universe';
import { calcDistance } from '../util/utils';

export class SolarSystemBoundsService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    for (let solarSystem of [...this.universe.solarSystems]) {
      let { planets } = solarSystem;
      for (let planet of [...planets]) {
        let distance = calcDistance(solarSystem.star, planet);
        if (distance > solarSystem.radius * 1.5) {
          solarSystem.removePlanet(planet);
          this.universe.addFreePlanet(planet);
        }
      }
    }
    for (let freePlanet of [...this.universe.freePlanets]) {
      for (let solarSystem of this.universe.solarSystems) {
        let distance = calcDistance(solarSystem.star, freePlanet);
        if (distance < solarSystem.radius * 0.75) {
          this.universe.removeFreePlanet(freePlanet);
          solarSystem.addPlanet(freePlanet);
        }
      }
    }
  }
}
