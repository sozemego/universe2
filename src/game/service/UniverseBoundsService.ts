import { Universe } from '../universe/Universe';
import { IGameService } from './index';
import { calcDistance } from '../util/utils';
import { calcAccelerationDueToGravity } from '../gravity';
import { Vector3 } from 'three';

const VECTOR3A = new Vector3();

export class UniverseBoundsService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    let backgroundBounds = this.universe.bounds.clone();
    backgroundBounds.radius *= 5;
    for (let solarSystem of [...this.universe.solarSystems]) {
      if (
        !backgroundBounds.containsPoint(
          VECTOR3A.set(solarSystem.position.x, solarSystem.position.y, 0)
        )
      ) {
        let [accelerationToCenter] = calcAccelerationDueToGravity(
          this.universe.centerStar,
          solarSystem
        );
        let distanceFromBounds =
          calcDistance(this.universe.centerStar, solarSystem) - backgroundBounds.radius;
        let multipleOfBoundsRadius = Math.ceil(distanceFromBounds / backgroundBounds.radius);
        solarSystem.accelerate(accelerationToCenter.multiplyScalar(500 * multipleOfBoundsRadius));
      }
    }
  }
}
