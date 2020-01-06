import { Universe } from '../universe/Universe';
import { ObjectFactory } from '../ObjectFactory';
import { Line, Vector2 } from 'three';
import { InputHandler, KEY } from '../InputHandler';
import { Planet } from '../object/Planet';
import { GameOptions } from '../GameOptions';
import { IGameService } from './index';

export class DebugOrbitService implements IGameService {
  private readonly universe: Universe;
  private readonly objectFactory: ObjectFactory;
  private readonly inputHandler: InputHandler;
  private circleMap: Record<string, Line> = {};
  private nextCircleMap: Record<string, Line> = {};
  private options: GameOptions;

  constructor(
    universe: Universe,
    objectFactory: ObjectFactory,
    inputHandler: InputHandler,
    options: GameOptions
  ) {
    this.universe = universe;
    this.objectFactory = objectFactory;
    this.inputHandler = inputHandler;
    this.options = options;
    this.inputHandler.onKeyDown(({ key }) => {
      if (key === KEY.L) {
        this.options.showDebugOrbits = true;
      }
    });
    this.inputHandler.onKeyUp(({ key }) => {
      if (key === KEY.SHIFT || key === KEY.L) {
        this.options.showDebugOrbits = false;
      }
    });
  }

  update(delta: number) {
    let enabled = this.options.showDebugOrbits;
    Object.values(this.circleMap).forEach(circle => {
      circle.visible = enabled;
    });
    if (!enabled) {
      return;
    }
    this.universe.solarSystems.forEach(solarSystem => {
      const { star } = solarSystem;
      solarSystem.planets.forEach(planet => {
        let circle = this.getCircle(planet);
        circle.position.x = star.position.x;
        circle.position.y = star.position.y;
        let distance = new Vector2(planet.position.x, planet.position.y).distanceTo(
          new Vector2(star.position.x, star.position.y)
        );
        circle.scale.x = distance;
        circle.scale.y = distance;
      });
    });
    Object.entries(this.circleMap).forEach(([key, value]) => {
      const isInNext = !!this.nextCircleMap[key];
      if (!isInNext) {
        value.parent?.remove(value);
      }
    });
    this.circleMap = this.nextCircleMap;
    this.nextCircleMap = {};
  }

  getCircle(planet: Planet): Line {
    let circle = this.circleMap[planet.id];
    if (!circle) {
      circle = this.objectFactory.createCircle(1, planet.color);
      this.circleMap[planet.id] = circle;
    }
    this.nextCircleMap[planet.id] = circle;
    return circle;
  }
}
