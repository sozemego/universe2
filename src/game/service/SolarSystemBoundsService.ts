import { IGameService } from './index';
import { Universe } from '../universe/Universe';
import { calcDistance } from '../util/utils';
import { GameObjectFactory } from '../GameObjectFactory';

export class SolarSystemBoundsService implements IGameService {
  private readonly universe: Universe;
  private readonly gameObjectFactory: GameObjectFactory;

  constructor(universe: Universe, gameObjectFactory: GameObjectFactory) {
    this.universe = universe;
    this.gameObjectFactory = gameObjectFactory;
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
        let largerRadius = Math.max(solarSystem1.radius, solarSystem2.radius);
        if (distance < smallerRadius) {
          solarSystem2.stars.forEach(star => solarSystem1.addStar(star));
          solarSystem2.stars.length = 0;
          solarSystem2.planets.forEach(planet => {
            solarSystem2.removePlanet(planet);
            solarSystem1.addPlanet(planet);
          });
          solarSystem1.radius = largerRadius * 1.25;
          solarSystem2.dispose();
          i--;
        }
      }
    }

    let newSolarSystems = [];
    for (let i = 0; i < solarSystems.length; i++) {
      let solarSystem = solarSystems[i];
      let { stars } = solarSystem;
      if (stars.length === 1) {
        continue;
      }
      for (let j = 0; j < stars.length; j++) {
        let star = stars[j];
        let distance = calcDistance(star, solarSystem);
        if (distance > solarSystem.radius * 1.5) {
          let newSolarSystem = this.gameObjectFactory.createSolarSystem([star], 2500);
          newSolarSystems.push(newSolarSystem);
          solarSystem.removeStar(star);
          j--;
        }
      }
    }
    newSolarSystems.forEach(system => this.universe.addSolarSystem(system));
  }
}
