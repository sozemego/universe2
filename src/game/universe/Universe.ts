import { Points, Sphere, Event } from 'three';
import { SolarSystem } from '../object/SolarSystem';
import { Star } from '../object/Star';
import { Planet } from '../object/Planet';

export class Universe {
  static UNIVERSE_RADIUS = 100000;
  static SCALE_INSIDE_SYSTEM = 60000;
  static MAX_CAMERA_Z = 500000;
  solarSystems: SolarSystem[] = [];
  freePlanets: Planet[] = [];
  centerStar: Star;
  bounds: Sphere;
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
      planet.addEventListener('remove', this.handleRemoveFreePlanet);
    });
    this.bounds = bounds;
    this.background = background;
  }

  update(delta: number) {
    if (this.centerStar) {
      this.centerStar.update(delta);
    }
    for (let solarSystem of this.solarSystems) {
      solarSystem.update(delta);
    }
    for (let freePlanet of this.freePlanets) {
      freePlanet.update(delta);
    }
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

  getAllStars() {
    let stars: Star[] = [];
    stars.push(this.centerStar);
    for (let solarSystem of this.solarSystems) {
      for (let star of solarSystem.stars) {
        stars.push(star);
      }
    }
    return stars;
  }
}
