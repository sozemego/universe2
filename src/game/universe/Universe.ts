import { Points, Sphere } from 'three';
import { SolarSystem } from '../object/SolarSystem';
import { Star } from '../object/Star';
import { calcDistance } from '../util/utils';
import { Planet } from '../object/Planet';

export class Universe {
  static UNIVERSE_RADIUS = 100000;
  static SCALE_INSIDE_SYSTEM = 60000;
  static MAX_CAMERA_Z = 100000;
  solarSystems: SolarSystem[] = [];
  freePlanets: Planet[] = [];
  centerStar: Star;
  private bounds: Sphere;
  background: Points;

  constructor(
    centerStar: Star,
    solarSystems: SolarSystem[],
    freePlanets: Planet[],
    background: Points,
    bounds: Sphere
  ) {
    this.centerStar = centerStar;
    this.solarSystems = solarSystems;
    this.solarSystems.forEach(system => {
      system.addEventListener('remove', event => {
        this.removeSolarSystem(system);
      });
    });
    this.freePlanets = freePlanets;
    this.freePlanets.forEach(planet => {
      planet.addEventListener('remove', event => {
        this.removeFreePlanet(planet);
      });
    });
    this.bounds = bounds;
    this.background = background;
  }

  removeSolarSystem(solarSystem: SolarSystem) {
    let index = this.solarSystems.findIndex(system => system === solarSystem);
    if (index > -1) {
      this.solarSystems.splice(index, 1);
    }
  }

  removeFreePlanet(planet: Planet) {
    let index = this.freePlanets.findIndex(freePlanet => freePlanet === planet);
    if (index > -1) {
      this.freePlanets.splice(index, 1);
    }
  }

  getCenter() {
    return this.bounds.center;
  }

  update(delta: number) {
    if (this.centerStar) {
      this.centerStar.update(delta);
    }
    let solarSystemsToRemove = [];
    for (let solarSystem of this.solarSystems) {
      solarSystem.update(delta);

      if (!this.bounds.containsPoint(solarSystem.star.position)) {
        solarSystem.dispose();
        solarSystemsToRemove.push(solarSystem);
        continue;
      }

      let { planets } = solarSystem;
      for (let i = 0; i < planets.length; i++) {
        let planet = planets[i];
        if (!this.bounds.containsPoint(planet.position)) {
          planet.dispose();
          planets.splice(i, 1);
        }
        let distance = calcDistance(solarSystem.star, planet);
        if (distance > solarSystem.radius * 1.5) {
          solarSystem.removePlanet(planet);
          this.freePlanets.push(planet);
        }
      }
    }
    let freePlanetsReunited: [Planet, SolarSystem][] = [];
    this.freePlanets.forEach(planet => planet.update(delta));
    for (let freePlanet of this.freePlanets) {
      for (let solarSystem of this.solarSystems) {
        let distance = calcDistance(solarSystem.star, freePlanet);
        if (distance < solarSystem.radius * 0.75) {
          freePlanetsReunited.push([freePlanet, solarSystem]);
        }
      }
    }
    for (let [planet, solarSystem] of freePlanetsReunited) {
      let index = this.freePlanets.findIndex(p => p === planet);
      if (index > -1) {
        this.freePlanets.splice(index, 1);
      }
      solarSystem.addPlanet(planet);
    }
    solarSystemsToRemove.forEach(solarSystem => {
      let index = this.solarSystems.findIndex(system => system === solarSystem);
      if (index > -1) {
        this.solarSystems.splice(index, 1);
      }
    });
  }
}
