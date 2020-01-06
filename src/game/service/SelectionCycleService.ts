import { Star } from '../object/Star';
import { Planet } from '../object/Planet';
import { next } from '../util/utils';
import { Universe } from '../universe/Universe';
import { SelectionContainer } from '../SelectionContainer';
import { InputHandler, KeyEvent } from '../InputHandler';
import { ObjectList } from '../ObjectList';
import { IGameService } from './index';

export class SelectionCycleService implements IGameService {
  private universe: Universe;
  private selectionContainer: SelectionContainer;
  private input: InputHandler;
  private objectList: ObjectList;

  constructor(
    universe: Universe,
    selectionContainer: SelectionContainer,
    input: InputHandler,
    objectList: ObjectList
  ) {
    this.universe = universe;
    this.selectionContainer = selectionContainer;
    this.input = input;
    this.objectList = objectList;
    this.input.onKeyUp(this.onKeyUpStars);
    this.input.onKeyUp(this.onKeyUpPlanets);
  }

  update(delta: number) {}

  onKeyUpStars = (event: KeyEvent) => {
    let direction =
      // @ts-ignore
      {
        '[': -1,
        ']': 1,
      }[event.key] || 0;

    if (direction === 0) {
      return;
    }
    this.cycleStars(direction);
  };

  cycleStars = (direction: number) => {
    let selected = this.objectList.findById(this.selectionContainer.selected);
    if (!selected) {
      this.selectionContainer.selected = this.universe.centerStar;
    }

    if (selected) {
      if (selected instanceof Star) {
        if (selected === this.universe.centerStar) {
          this.selectionContainer.selected = this.universe.solarSystems[0].star;
        } else {
          const allStars = this.universe.solarSystems.map(system => system.star);
          this.selectionContainer.selected = next(selected, allStars);
        }
      }
      if (selected instanceof Planet) {
        const isInSolarSystem = !!selected.solarSystem;
        if (isInSolarSystem) {
          this.selectionContainer.selected = selected.solarSystem!.star;
        } else {
        }
      }
    }
  };

  onKeyUpPlanets = (event: KeyEvent) => {
    let direction =
      //@ts-ignore
      {
        '{': -1,
        '}': 1,
      }[event.key] || 0;

    if (direction === 0) {
      return;
    }
    this.cyclePlanets(direction);
  };

  cyclePlanets = (direction: number) => {
    let selected = this.objectList.findById(this.selectionContainer.selected);
    if (!selected) {
      return;
    }

    if (direction) {
      if (selected instanceof Star) {
        if (selected.solarSystem) {
          const firstPlanet = selected.solarSystem.planets[0];
          this.selectionContainer.selected = firstPlanet;
        }
      }
      if (selected instanceof Planet) {
        const isInSolarSystem = !!selected.solarSystem;
        if (isInSolarSystem) {
          const planets = selected.solarSystem!.planets;
          this.selectionContainer.selected = next(selected, planets);
        }
      }
    }
  };
}
