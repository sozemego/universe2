import { Universe } from '../universe/Universe';
import { IGameService } from './index';
import { calcDistance } from '../util/utils';
import { calcAccelerationDueToGravity } from '../gravity';

export class UniverseBoundsService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    let backgroundBounds = this.universe.bounds.clone();
    backgroundBounds.radius *= 5;
    for (let solarSystem of [...this.universe.solarSystems]) {
      if (!backgroundBounds.containsPoint(solarSystem.star.position)) {
        let [accelerationToCenter] = calcAccelerationDueToGravity(
          this.universe.centerStar,
          solarSystem.star
        );
        let distanceFromBounds =
          calcDistance(this.universe.centerStar, solarSystem.star) - backgroundBounds.radius;
        let multipleOfBoundsRadius = Math.ceil(distanceFromBounds / backgroundBounds.radius);
        solarSystem.accelerate(accelerationToCenter.multiplyScalar(500 * multipleOfBoundsRadius));
      }
    }
    for (let freePlanet of [...this.universe.freePlanets]) {
      if (!backgroundBounds.containsPoint(freePlanet.position)) {
        let [accelerationToCenter] = calcAccelerationDueToGravity(
          this.universe.centerStar,
          freePlanet
        );
        let distanceFromBounds =
          calcDistance(this.universe.centerStar, freePlanet) - backgroundBounds.radius;
        let multipleOfBoundsRadius = Math.ceil(distanceFromBounds / backgroundBounds.radius);
        freePlanet.accelerate(accelerationToCenter.multiplyScalar(500 * multipleOfBoundsRadius));
      }
    }
  }
}
