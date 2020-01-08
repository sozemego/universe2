import { Universe } from '../universe/Universe';
import { IGameService } from './index';
import { calcDistance } from '../util/utils';

export class UniverseBoundsService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    let backgroundBounds = this.universe.bounds.clone();
    backgroundBounds.radius *= 5;
    for (let solarSystem of [...this.universe.solarSystems]) {
      if (!backgroundBounds.containsPoint(solarSystem.star.position)) {
        solarSystem.dispose();
        continue;
      }

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
      if (!backgroundBounds.containsPoint(freePlanet.position)) {
        freePlanet.dispose();
        continue;
      }
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
