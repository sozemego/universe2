import { Universe } from './universe/Universe';
import { ObjectList } from './ObjectList';
import { GameEngine } from './GameEngine';
import { InputHandler, KEY } from './InputHandler';
import { IGameService } from './service';
import { SelectionService } from './service/SelectionService';
import { GameOptions } from './GameOptions';
import { Clock } from 'three';
import { Dispatch } from 'redux';
import { ServiceStatsMap, setServiceStatsMap } from './ui/state';
import { PlanetService } from './service/PlanetService';
import { Planet } from './object/Planet';
import { CONSTANTS } from './Constants';

export class GameService {
  private readonly engine: GameEngine;
  private readonly input: InputHandler;
  private readonly universe: Universe;
  private readonly objectList: ObjectList;
  private services: IGameService[];
  private accumulator: number;
  private readonly selectionService: SelectionService;
  private readonly options: GameOptions;
  private readonly dispatch: Dispatch;
  private readonly stats: ServiceStatsMap = {};
  private updates: number = 0;

  constructor(
    engine: GameEngine,
    input: InputHandler,
    objectList: ObjectList,
    selectionService: SelectionService,
    universe: Universe,
    options: GameOptions,
    dispatch: Dispatch,
    services: IGameService[]
  ) {
    this.engine = engine;
    this.input = input;
    this.objectList = objectList;
    this.selectionService = selectionService;
    this.universe = universe;
    this.accumulator = 0;
    this.options = options;
    this.dispatch = dispatch;
    this.services = services;
    this.services.forEach(service => {
      let name = service.constructor.name;
      this.stats[name] = {
        name,
        average: 0,
        max: Number.MIN_SAFE_INTEGER,
        min: Number.MAX_SAFE_INTEGER,
        previous: [],
        current: 0,
      };
    });
  }

  start(): Promise<void> {
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

    return this.engine.start().then(() => {
      this.selectionService.selected = this.universe.centerStar;
      this.input.pressKey(']');
      this.input.pressKey(']');
      this.input.pressKey('}');
      this.input.pressKey('O');
      this.input.pressKey('i');
      let planetService = this.services.find(s => s.constructor === PlanetService) as PlanetService;
      planetService!.colonizePlanet(this.selectionService.selected as Planet);
    });
  }

  update = (delta: number) => {
    let newDelta = delta * this.options.gameSpeedScale;
    for (let i = 0; i < this.options.gameSpeed; i++) {
      this.accumulator += delta;
      while (this.accumulator >= CONSTANTS.FPS) {
        this.accumulator -= CONSTANTS.FPS;

        this.universe.update(newDelta);
        this.services.forEach(service => {
          let clock = new Clock();
          clock.start();
          service.update(newDelta);
          clock.stop();
          let time = clock.getElapsedTime() * 1000;
          let name = service.constructor.name;
          let stats = this.stats[name];
          stats.previous[this.updates % 50] = time;
          stats.average =
            stats.previous.reduce((total, next) => total + next, 0) / stats.previous.length;
          stats.previous.sort((a, b) => a - b);
          stats.min = stats.previous[0];
          stats.max = stats.previous[stats.previous.length - 1];
          stats.current = time;
        });
        this.updates++;
      }
    }
    this.dispatchStats();
  };

  dispatchStats() {
    let stats: ServiceStatsMap = {};
    Object.values(this.stats).forEach(stat => {
      stats[stat.name] = { ...stat, previous: [...stat.previous] };
    });
    // @ts-ignore
    this.dispatch(setServiceStatsMap(stats));
  }
}
