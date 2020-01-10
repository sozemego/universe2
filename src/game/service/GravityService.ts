import { Clock } from 'three';
import { IGameService } from './index';
import { Universe } from '../universe/Universe';
import { FLAGS } from '../../flags';
import { calcAccelerationDueToGravity, MassObject } from '../gravity';

export class GravityService implements IGameService {
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
        let stars1 = solarSystem1.stars;
        let stars2 = solarSystem2.stars;
        for (let star1 of stars1) {
          for (let star2 of stars2) {
            let [accelerationA, accelerationB] = this.calcAccelerationDueToGravity(star1, star2);
            star2.accelerate(accelerationA);
            solarSystem2.planets.forEach(planet => planet.accelerate(accelerationA));
            star1.accelerate(accelerationB);
            solarSystem1.planets.forEach(planet => planet.accelerate(accelerationB));
          }
        }
      }
    }

    if (centerStar) {
      for (let solarSystem of solarSystems) {
        for (let star of solarSystem.stars) {
          let [accelerationA] = this.calcAccelerationDueToGravity(centerStar, solarSystem);
          star.accelerate(accelerationA);
          solarSystem.planets.forEach(planet => planet.accelerate(accelerationA));
        }
      }
    }

    for (let solarSystem of solarSystems) {
      let { stars, planets } = solarSystem;
      for (let i = 0; i < planets.length; i++) {
        let planet1 = planets[i];
        for (let star of stars) {
          let [accelerationToStar] = this.calcAccelerationDueToGravity(star, planet1);
          planet1.accelerate(accelerationToStar);
        }
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
      for (let freePlanet of freePlanets) {
        let [accelerationToStar] = this.calcAccelerationDueToGravity(solarSystem, freePlanet);
        freePlanet.accelerate(accelerationToStar);
      }
    }

    if (FLAGS.GRAVITY_WORKER_PERF) {
      clock!.stop();
      let time = clock!.getElapsedTime();
      console.log(`gravityCalcs = ${this.gravityCalcs}. Took ${(time * 1000).toFixed(2)}ms`);
    }
  }

  calcAccelerationDueToGravity(attractor: MassObject, attractee: MassObject) {
    let [accelerationA, accelerationB] = calcAccelerationDueToGravity(attractor, attractee);
    if (FLAGS.GRAVITY_WORKER_PERF) {
      this.gravityCalcs++;
    }
    return [accelerationA.multiplyScalar(this.delta), accelerationB.multiplyScalar(this.delta)];
  }
}
