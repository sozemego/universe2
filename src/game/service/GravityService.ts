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
