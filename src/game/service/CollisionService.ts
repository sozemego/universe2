import { Universe } from '../Universe';
import { SelectionContainer } from '../SelectionContainer';
import { IGameService } from './index';

export class CollisionService implements IGameService {
  private readonly universe: Universe;
  private selectionContainer: SelectionContainer;

  constructor(universe: Universe, selectionContainer: SelectionContainer) {
    this.universe = universe;
    this.selectionContainer = selectionContainer;
  }

  update(delta: number) {
    let { centerStar, solarSystems } = this.universe;
    const stars = [centerStar!, ...solarSystems.map(system => system.star)];
    for (let star1 of stars) {
      for (let star2 of stars) {
        if (star1 === star2) continue;
        if (star1.sphere.intersectsSphere(star2.sphere)) {
          const starToDestroy = star1.mass > star2.mass ? star2 : star1;
          starToDestroy.solarSystem?.dispose();
        }
      }
    }
    for (let solarSystem of solarSystems) {
      const { star } = solarSystem;
      const { planets } = solarSystem;
      for (let planet1 of planets) {
        if (planet1.sphere.intersectsSphere(star.sphere)) {
          planet1.dispose();
          continue;
        }
        for (let planet2 of planets) {
          if (planet1 === planet2) continue;
          if (planet1.sphere.intersectsSphere(planet2.sphere)) {
            const planetToDestroy = planet1.mass > planet2.mass ? planet2 : planet1;
            planetToDestroy.dispose();
          }
        }
      }
    }
  }
}
