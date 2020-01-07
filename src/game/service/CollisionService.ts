import { Universe } from '../universe/Universe';
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
    for (let i = 0; i < stars.length; i++) {
      let star1 = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        let star2 = stars[j];
        if (star1.sphere.intersectsSphere(star2.sphere)) {
          const starToDestroy = star1.mass > star2.mass ? star2 : star1;
          starToDestroy.solarSystem?.dispose();
        }
      }
    }

    for (let solarSystem of solarSystems) {
      const { star } = solarSystem;
      const { planets } = solarSystem;

      for (let i = 0; i < planets.length; i++) {
        let planet1 = planets[i];
        if (planet1.sphere.intersectsSphere(star.sphere)) {
          planet1.dispose();
          continue;
        }
        for (let j = i + 1; j < planets.length; j++) {
          let planet2 = planets[j];
          if (planet1.sphere.intersectsSphere(planet2.sphere)) {
            const planetToDestroy = planet1.mass > planet2.mass ? planet2 : planet1;
            planetToDestroy.dispose();
          }
        }
      }
    }
  }
}
