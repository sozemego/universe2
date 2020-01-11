import { IGameService } from './index';
import { Universe } from '../universe/Universe';

export class FixedGravityService implements IGameService {
  private readonly universe: Universe;

  constructor(universe: Universe) {
    this.universe = universe;
  }

  update(delta: number) {
    let { solarSystems, centerStar } = this.universe;
    for (let solarSystem of solarSystems) {
      let { orbitalDistance, angularVelocity, angle } = solarSystem;
      let nextAngle = angle + angularVelocity * delta;
      if (nextAngle > 360) {
        nextAngle -= 360;
      }
      let x = centerStar.position.x + orbitalDistance * Math.cos(nextAngle * (Math.PI / 180));
      let y = centerStar.position.y + orbitalDistance * Math.sin(nextAngle * (Math.PI / 180));
      solarSystem.position.x = x;
      solarSystem.position.y = y;
      solarSystem.angle = nextAngle;
    }
    for (let solarSystem of solarSystems) {
      let { planets } = solarSystem;
      for (let planet of planets) {
        let { orbitalDistance, angularVelocity, angle } = planet;
        let nextAngle = angle + angularVelocity * delta;
        if (nextAngle > 360) {
          nextAngle -= 360;
        }
        let x = solarSystem.position.x + orbitalDistance * Math.cos(nextAngle * (Math.PI / 180));
        let y = solarSystem.position.y + orbitalDistance * Math.sin(nextAngle * (Math.PI / 180));
        planet.position.x = x;
        planet.position.y = y;
        planet.angle = nextAngle;
      }
    }
  }
}
