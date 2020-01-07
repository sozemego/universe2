import { Points, Sphere, Event } from 'three';
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

  update(delta: number) {
    if (this.centerStar) {
      this.centerStar.update(delta);
    }
    let backgroundBounds = this.bounds.clone();
    backgroundBounds.radius *= 5;
    let solarSystemsToRemove = [];
    for (let solarSystem of this.solarSystems) {
      solarSystem.update(delta);

      if (!backgroundBounds.containsPoint(solarSystem.star.position)) {
        solarSystemsToRemove.push(solarSystem);
        continue;
      }

      let { planets } = solarSystem;
      for (let i = 0; i < planets.length; i++) {
        let planet = planets[i];
        let distance = calcDistance(solarSystem.star, planet);
        if (distance > solarSystem.radius * 1.5) {
          solarSystem.removePlanet(planet);
          this.addFreePlanet(planet);
        }
      }
    }
    let freePlanetsReunited: [Planet, SolarSystem][] = [];
    let planetsToRemove: Planet[] = [];
    for (let freePlanet of this.freePlanets) {
      freePlanet.update(delta);
      if (!backgroundBounds.containsPoint(freePlanet.position)) {
        planetsToRemove.push(freePlanet);
        continue;
      }
      for (let solarSystem of this.solarSystems) {
        let distance = calcDistance(solarSystem.star, freePlanet);
        if (distance < solarSystem.radius * 0.75) {
          freePlanetsReunited.push([freePlanet, solarSystem]);
        }
      }
    }
    for (let [planet, solarSystem] of freePlanetsReunited) {
      this.removeFreePlanet(planet);
      solarSystem.addPlanet(planet);
    }
    solarSystemsToRemove.forEach(solarSystem => {
      solarSystem.dispose();
    });
    planetsToRemove.forEach(planet => {
      planet.dispose();
    });
  }

  addFreePlanet(planet: Planet) {
    this.freePlanets.push(planet);
    if (!planet.hasEventListener('remove', this.handleRemoveFreePlanet)) {
      planet.addEventListener('remove', this.handleRemoveFreePlanet);
    }
  }

  handleRemoveFreePlanet = (event: Event) => {
    this.removeFreePlanet(event.target as Planet);
  };

  removeFreePlanet(planet: Planet) {
    let index = this.freePlanets.findIndex(freePlanet => freePlanet === planet);
    if (index > -1) {
      this.freePlanets.splice(index, 1);
    }
  }

  removeSolarSystem(solarSystem: SolarSystem) {
    let index = this.solarSystems.findIndex(system => system === solarSystem);
    if (index > -1) {
      this.solarSystems.splice(index, 1);
    }
  }
}
