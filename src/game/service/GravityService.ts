import { Vector2 } from 'three';
// @ts-ignore
import GravityWorker from '../worker/gravity.worker';
import { Universe } from '../Universe';
import { Star } from '../object/Star';
import { Planet } from '../object/Planet';
import { CalcData, ResultData } from '../worker';
import { IGameService } from './index';
import { FLAGS } from '../../flags';

export class GravityService implements IGameService {
  private universe: Universe;
  private gravityWorker: Worker;
  private currentUpdate: number = 0;
  private nextUpdate: number = 0;
  private lastResultApplied: number = Date.now();
  private differences: number[] = [];

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
    if (this.nextUpdate !== this.currentUpdate) {
      return;
    }
    // console.log(`sending data for frame ${this.currentUpdate}`)
    this.gravityWorker.postMessage({
      type: 'gravityCalc',
      data: this.prepareData(),
    });
    this.currentUpdate += 1;
  }

  applyResult(resultData: ResultData) {
    // console.log(`applying result for frame ${this.currentUpdate}`)
    let result = resultData;
    let vector = new Vector2();
    for (const solarSystem of this.universe.solarSystems) {
      const { star } = solarSystem;
      const starAcceleration = result[solarSystem.star.id];
      if (starAcceleration) {
        star.accelerate(vector.set(starAcceleration.x, starAcceleration.y));
      }
      const { planets } = solarSystem;
      for (const planet of planets) {
        const planetAcceleration = result[planet.id];
        if (planetAcceleration) {
          planet.accelerate(vector.set(planetAcceleration.x, planetAcceleration.y));
        }
      }
    }
    for (const planet of this.universe.freePlanets) {
      const acceleration = result[planet.id];
      if (acceleration) {
        planet.accelerate(vector.set(acceleration.x, acceleration.y));
      }
    }
    this.nextUpdate += 1;
    if (FLAGS.GRAVITY_WORKER_PERF) {
      let now = Date.now();
      let timeDiff = now - this.lastResultApplied;
      this.differences.push(timeDiff);
      while (this.differences.length > 200) {
        this.differences.shift();
      }
      let average =
        this.differences.reduce((curr, next) => {
          return curr + next;
        }, 0) / this.differences.length;
      console.log(
        `Time difference of ${timeDiff} ms between last and current applyResult. Average difference is now = ${average}`
      );
      this.lastResultApplied = now;
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
    this.nextUpdate = this.currentUpdate;
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
