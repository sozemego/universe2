import { Sphere } from 'three';
import { SolarSystem } from '../object/SolarSystem';
import { Star } from '../object/Star';
import { Planet } from '../object/Planet';

export class Universe {
  static UNIVERSE_RADIUS = 100000;
  static SCALE_INSIDE_SYSTEM = 60000;
  static MAX_CAMERA_Z = 500000;
  solarSystems: SolarSystem[] = [];
  centerStar: Star;
  bounds: Sphere;

  constructor(
    centerStar: Star,
    solarSystems: SolarSystem[],
    freePlanets: Planet[],
    bounds: Sphere
  ) {
    this.centerStar = centerStar;
    this.solarSystems = [];
    solarSystems.forEach(this.addSolarSystem);
    this.bounds = bounds;
  }

  update(delta: number) {
    if (this.centerStar) {
      this.centerStar.update(delta);
    }
    for (let solarSystem of this.solarSystems) {
      solarSystem.update(delta);
    }
  }

  removeSolarSystem(solarSystem: SolarSystem) {
    let index = this.solarSystems.findIndex(system => system === solarSystem);
    if (index > -1) {
      this.solarSystems.splice(index, 1);
    }
  }

  addSolarSystem = (solarSystem: SolarSystem) => {
    this.solarSystems.push(solarSystem);
    solarSystem.addEventListener('remove', event => {
      this.removeSolarSystem(solarSystem);
    });
  };

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
