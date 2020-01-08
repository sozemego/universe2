import { Vector2, Clock } from 'three';
import { IGameService } from './index';
import { Universe } from '../universe/Universe';
import { FLAGS } from '../../flags';
import { BaseObject } from '../object/BaseObject';
import { calcAccelerationDueToGravity } from '../gravity';

const vector2A = new Vector2();
const vector2B = new Vector2();

export class MainThreadGravityService implements IGameService {
  private readonly universe: Universe;
  private gravityCalcs: number = 0;
  private delta: number = 0;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    this.delta = delta;
    let clock = null;
    if (FLAGS.GRAVITY_WORKER_PERF) {
      this.gravityCalcs = 0;
      clock = new Clock();
      clock.start();
    }
    let { solarSystems, centerStar, freePlanets } = this.universe;
    for (let i = 0; i < solarSystems.length; i++) {
      let solarSystem1 = solarSystems[i];
      for (let j = i + 1; j < solarSystems.length; j++) {
        let solarSystem2 = solarSystems[j];
        let star1 = solarSystem1.star;
        let star2 = solarSystem2.star;
        let [accelerationA, accelerationB] = this.calcAccelerationDueToGravity(star1, star2);
        solarSystem2.accelerate(accelerationA);
        solarSystem1.accelerate(accelerationB);
      }
    }

    if (centerStar) {
      for (let solarSystem of solarSystems) {
        let star = solarSystem.star;
        let [accelerationA] = this.calcAccelerationDueToGravity(centerStar, star);
        solarSystem.accelerate(accelerationA);
      }
    }

    for (let solarSystem of solarSystems) {
      let star = solarSystem.star;
      let planets = solarSystem.planets;
      for (let i = 0; i < planets.length; i++) {
        let planet1 = planets[i];
        let [accelerationToStar] = this.calcAccelerationDueToGravity(star, planet1);
        planet1.accelerate(accelerationToStar);
        for (let j = i + 1; j < planets.length; j++) {
          let planet2 = planets[j];
          let [accelerationA, accelerationB] = this.calcAccelerationDueToGravity(planet1, planet2);
          planet2.accelerate(accelerationA);
          planet1.accelerate(accelerationB);
        }
      }
    }

    if (centerStar) {
      for (let freePlanet of freePlanets) {
        let [accelerationToCenter] = this.calcAccelerationDueToGravity(centerStar, freePlanet);
        freePlanet.accelerate(accelerationToCenter);
      }
    }

    for (let solarSystem of solarSystems) {
      let star = solarSystem.star;
      for (let freePlanet of freePlanets) {
        let [accelerationToStar] = this.calcAccelerationDueToGravity(star, freePlanet);
        freePlanet.accelerate(accelerationToStar);
      }
    }

    if (FLAGS.GRAVITY_WORKER_PERF) {
      clock!.stop();
      let time = clock!.getElapsedTime();
      console.log(`gravityCalcs = ${this.gravityCalcs}. Took ${(time * 1000).toFixed(2)}ms`);
    }
  }

  calcAccelerationDueToGravity(attractor: BaseObject, attractee: BaseObject) {
    let [accelerationA, accelerationB] = calcAccelerationDueToGravity(attractor, attractee);
    if (FLAGS.GRAVITY_WORKER_PERF) {
      this.gravityCalcs++;
    }
    return [accelerationA.multiplyScalar(this.delta), accelerationB.multiplyScalar(this.delta)];
  }
}
