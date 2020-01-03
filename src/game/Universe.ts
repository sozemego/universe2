import { Points, Sphere } from 'three';
import { SolarSystem } from './object/SolarSystem';
import { Star } from './object/Star';
import { calcDistance } from './util/utils';
import { Planet } from './object/Planet';

export class Universe {
  static UNIVERSE_RADIUS = 5000000;
  static SCALE_INSIDE_SYSTEM = 10000;
  static MAX_CAMERA_Z = 5000000;
  solarSystems: SolarSystem[] = [];
  freePlanets: Planet[] = [];
  centerStar: Star | null;
  private bounds: Sphere;
  background: Points | null;

  constructor(
    centerStar: Star,
    solarSystems: SolarSystem[],
    freePlanets: Planet[],
    background: Points,
    bounds: Sphere
  ) {
    this.centerStar = centerStar;
    this.solarSystems = solarSystems;
    this.freePlanets = freePlanets;
    this.bounds = bounds;
    this.background = background;
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
    this.freePlanets.forEach(planet => planet.update(delta));
    solarSystemsToRemove.forEach(solarSystem => {
      let index = this.solarSystems.findIndex(system => system === solarSystem);
      if (index > -1) {
        this.solarSystems.splice(index, 1);
      }
    });
  }
}
