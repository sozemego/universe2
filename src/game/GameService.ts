import { Universe } from './universe/Universe';
import { ObjectList } from './ObjectList';
import { GameEngine } from './GameEngine';
import { InputHandler, KEY } from './InputHandler';
import { IGameService } from './service';
import { SelectionService } from './service/SelectionService';
import { GameOptions } from './GameOptions';

export class GameService {
  static FPS = 1 / 60;
  private readonly engine: GameEngine;
  private readonly input: InputHandler;
  private readonly universe: Universe;
  private readonly objectList: ObjectList;
  private services: IGameService[];
  private accumulator: number;
  private readonly selectionService: SelectionService;
  private readonly options: GameOptions;

  constructor(
    engine: GameEngine,
    input: InputHandler,
    objectList: ObjectList,
    selectionService: SelectionService,
    universe: Universe,
    options: GameOptions,
    services: IGameService[]
  ) {
    this.engine = engine;
    this.input = input;
    this.objectList = objectList;
    this.selectionService = selectionService;
    this.universe = universe;
    this.accumulator = 0;
    this.options = options;
    this.services = services;
  }

  start() {
    let engine = this;
    this.engine.setUpdate(function gameServiceUpdate(delta: number) {
      engine.update(delta);
    });
    this.input.onKeyDown(({ key }) => {
      if (key === KEY.PLUS) {
        this.options.gameSpeed = this.options.gameSpeed + 1;
      }
      if (key === KEY.MINUS) {
        this.options.gameSpeed = this.options.gameSpeed - 1;
      }
    });

    this.engine.start();
    this.selectionService.selected = this.universe.centerStar;
    // this.input.pressKey(']');
    // this.input.pressKey(']');
    this.input.pressKey('o');
    this.input.pressKey('i');
  }

  update = (delta: number) => {
    delta *= this.options.gameSpeedScale;
    for (let i = 0; i < this.options.gameSpeed; i++) {
      this.accumulator += delta;
      while (this.accumulator >= GameService.FPS) {
        this.accumulator -= GameService.FPS;

        this.universe.update(delta);
        this.services.forEach(service => service.update(delta));
      }
    }
  };
}
