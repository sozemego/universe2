import { Vector2 } from 'three';
// @ts-ignore
import GravityWorker from '../worker/gravity.worker';
import { Universe } from '../Universe';
import { Star } from '../object/Star';
import { Planet } from '../object/Planet';
import { CalcData, ResultData } from '../worker';
import { IGameService } from './index';

export class GravityService implements IGameService {
  private universe: Universe;
  private gravityWorker: Worker;

  constructor(universe: Universe) {
    this.universe = universe;
    // @ts-ignore
    this.gravityWorker = new GravityWorker();
    this.gravityWorker.addEventListener('message', (message: any) => {
      if (message.data.type === 'gravityCalcResult') {
        this.applyResult(message.data.result);
      }
    });
  }

  update(delta: number) {
    this.gravityWorker.postMessage({
      type: 'gravityCalc',
      data: this.prepareData(),
    });
  }

  applyResult(result: ResultData) {
    for (const solarSystem of this.universe.solarSystems) {
      const { star } = solarSystem;
      const starAcceleration = result[solarSystem.star.id];
      if (starAcceleration) {
        star.accelerate(new Vector2(starAcceleration.x, starAcceleration.y));
      }
      const { planets } = solarSystem;
      for (const planet of planets) {
        const planetAcceleration = result[planet.id];
        if (planetAcceleration) {
          planet.accelerate(new Vector2(planetAcceleration.x, planetAcceleration.y));
        }
      }
    }
    for (const planet of this.universe.freePlanets) {
      const acceleration = result[planet.id];
      if (acceleration) {
        planet.accelerate(new Vector2(acceleration.x, acceleration.y));
      }
    }
  }

  prepareData() {
    const data: CalcData = {
      centerStar: null,
      stars: [],
      planets: {},
      freePlanets: [],
    };
    const centerStar = this.universe.centerStar;
    data.centerStar = centerStar ? this.prepareStarData(centerStar) : null;
    for (const solarSystem of this.universe.solarSystems) {
      data.stars.push(this.prepareStarData(solarSystem.star));
    }
    for (const solarSystem of this.universe.solarSystems) {
      const { planets } = solarSystem;
      const planetsData = [];
      for (const planet of planets) {
        const planetData = this.preparePlanetData(planet);
        planetsData.push(planetData);
      }
      data.planets[solarSystem.star.id] = planetsData;
    }
    for (const planet of this.universe.freePlanets) {
      data.freePlanets.push(this.preparePlanetData(planet));
    }
    return data;
  }

  prepareStarData(star: Star) {
    return {
      id: star.id,
      mass: star.mass,
      position: { x: star.position.x, y: star.position.y },
    };
  }

  preparePlanetData(planet: Planet) {
    return {
      id: planet.id,
      mass: planet.mass,
      position: { x: planet.position.x, y: planet.position.y },
    };
  }
}
