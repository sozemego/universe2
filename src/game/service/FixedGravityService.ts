import { IGameService } from './index';
import { Universe } from '../universe/Universe';
import { angleBetween } from '../../mathUtils';

export class FixedGravityService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    let { solarSystems } = this.universe;
    for (let solarSystem of solarSystems) {
      let { planets } = solarSystem;
      for (let planet of planets) {
        let { orbitalDistance, angularVelocity } = planet;
        let angle = angleBetween(planet.position, solarSystem.position) * (180 / Math.PI);
        let nextAngle = (angle + angularVelocity * delta) * (Math.PI / 180);
        let x = solarSystem.position.x + orbitalDistance * Math.cos(nextAngle);
        let y = solarSystem.position.y + orbitalDistance * Math.sin(nextAngle);
        planet.position.x = x;
        planet.position.y = y;
      }
    }
  }
}
