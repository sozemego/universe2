import { IGameService } from './index';
import { Universe } from '../universe/Universe';
import { calcDistance } from '../util/utils';

export class SolarSystemBoundsService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    this.handleSolarSystemSplitJoin();
    this.handlePlanetSplitJoin();
  }

  handlePlanetSplitJoin() {
    for (let solarSystem of [...this.universe.solarSystems]) {
      let { planets } = solarSystem;
      for (let planet of [...planets]) {
        let distance = calcDistance(solarSystem, planet);
        if (distance > solarSystem.radius * 1.5) {
          solarSystem.removePlanet(planet);
          this.universe.addFreePlanet(planet);
        }
      }
    }
    for (let freePlanet of [...this.universe.freePlanets]) {
      for (let solarSystem of this.universe.solarSystems) {
        let distance = calcDistance(solarSystem, freePlanet);
        if (distance < solarSystem.radius * 0.75) {
          this.universe.removeFreePlanet(freePlanet);
          solarSystem.addPlanet(freePlanet);
        }
      }
    }
  }

  handleSolarSystemSplitJoin() {
    let solarSystems = this.universe.solarSystems;
    for (let i = 0; i < solarSystems.length; i++) {
      let solarSystem1 = solarSystems[i];
      for (let j = i + 1; j < solarSystems.length; j++) {
        let solarSystem2 = solarSystems[j];
        let distance = calcDistance(solarSystem1, solarSystem2);
        let smallerRadius = Math.min(solarSystem1.radius, solarSystem2.radius);
        if (distance < smallerRadius) {
          solarSystem2.stars.forEach(star => solarSystem1.addStar(star));
          solarSystem2.stars.length = 0;
          solarSystem2.planets.forEach(planet => {
            solarSystem2.removePlanet(planet);
            solarSystem1.addPlanet(planet);
          });
          solarSystem1.radius = solarSystem1.radius + solarSystem2.radius;
          solarSystem2.dispose();
          i--;
        }
      }
    }
  }
}
