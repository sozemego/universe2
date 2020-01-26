import { Universe } from '../universe/Universe';
import { ObjectFactory } from '../ObjectFactory';
import { Line, Material, Vector2 } from 'three';
import { InputHandler, KEY } from '../InputHandler';
import { Planet } from '../object/Planet';
import { GameOptions } from '../GameOptions';
import { IGameService } from './index';
import { SelectionService } from './SelectionService';
import { Star } from '../object/Star';

export class DebugOrbitService implements IGameService {
  private readonly universe: Universe;
  private readonly objectFactory: ObjectFactory;
  private readonly inputHandler: InputHandler;
  private readonly selectionService: SelectionService;
  private readonly options: GameOptions;
  private circleMap: Record<string, Line> = {};
  private nextCircleMap: Record<string, Line> = {};

  constructor(
    universe: Universe,
    objectFactory: ObjectFactory,
    inputHandler: InputHandler,
    options: GameOptions,
    selectionService: SelectionService
  ) {
    this.universe = universe;
    this.objectFactory = objectFactory;
    this.inputHandler = inputHandler;
    this.options = options;
    this.selectionService = selectionService;
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
    let mouseOver = this.selectionService.mouseOver;
    let selected = mouseOver || this.selectionService.selected;
    if (selected instanceof Planet) {
      this.updateCircle(selected, true);
    }
    if (selected instanceof Star && selected.solarSystem) {
      let { planets } = selected.solarSystem;
      planets.forEach(planet => this.updateCircle(planet, true));
    }
    if (!enabled) {
      return;
    }
    this.universe.solarSystems.forEach(solarSystem => {
      solarSystem.planets.forEach(planet => {
        this.updateCircle(planet, enabled);
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

  updateCircle(planet: Planet, enabled: boolean) {
    let circle = this.getCircle(planet);
    circle.visible = enabled;
    let { solarSystem } = planet;
    circle.position.x = planet.solarSystem!.position.x;
    circle.position.y = planet.solarSystem!.position.y;
    let distance = new Vector2(planet.position.x, planet.position.y).distanceTo(
      new Vector2(solarSystem!.position.x, solarSystem!.position.y)
    );
    circle.scale.x = distance;
    circle.scale.y = distance;
  }

  getCircle(planet: Planet): Line {
    let circle = this.circleMap[planet.id];
    if (!circle) {
      circle = this.objectFactory.createCircle(1, planet.color);
      if (circle.material instanceof Material) {
        circle.material.opacity = 0.25;
      }
      circle.renderOrder = -1;
      this.circleMap[planet.id] = circle;
    }
    this.nextCircleMap[planet.id] = circle;
    return circle;
  }
}
