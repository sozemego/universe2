import { InputHandler, KEY, Mouse } from '../InputHandler';
import { Universe } from '../universe/Universe';
import { GameObjectFactory } from '../GameObjectFactory';
import { Dispatch } from 'redux';
import { ObjectToSpawn, setObjectToSpawn, TypeOfObjectToSpawn } from '../ui/state';
import { store } from '../../store';
import { useGetObjectToSpawn } from '../ui/selectors';
import { ObjectFactory } from '../ObjectFactory';
import { GameCamera } from '../GameCamera';
import { Color, Line, Vector2 } from 'three';

export class SpawnObjectService {
  private readonly input: InputHandler;
  private readonly universe: Universe;
  private readonly camera: GameCamera;
  private readonly objectFactory: ObjectFactory;
  private readonly gameObjectFactory: GameObjectFactory;
  private readonly dispatch: Dispatch;
  private spawn: boolean = false;
  private mouseCircle: Line;

  constructor(
    input: InputHandler,
    universe: Universe,
    camera: GameCamera,
    objectFactory: ObjectFactory,
    gameObjectFactory: GameObjectFactory,
    dispatch: Dispatch
  ) {
    this.input = input;
    this.input.onKeyDown(({ key }) => {
      if (key === KEY.m) {
        this.spawn = true;
        this.mouseCircle.visible = true;
        return true;
      }
    });
    this.input.onKeyUp(({ key }) => {
      if (key === KEY.m) {
        this.spawn = false;
        this.mouseCircle.visible = false;
        return true;
      }
    });
    this.input.onMouseUp(mouse => {
      if (!this.spawn) {
        return true;
      }
      this.spawnAt(mouse);
    });
    this.input.onMouseMove(mouse => {
      let worldCoordinates = this.camera.mouseToWorld(mouse);
      this.mouseCircle.position.x = worldCoordinates.x;
      this.mouseCircle.position.y = worldCoordinates.y;
    });
    this.universe = universe;
    this.camera = camera;
    this.objectFactory = objectFactory;
    this.gameObjectFactory = gameObjectFactory;
    this.dispatch = dispatch;

    this.mouseCircle = objectFactory.createCircle(1024, Color.NAMES['gold']);
    this.mouseCircle.visible = false;
  }

  get objectToSpawn() {
    return useGetObjectToSpawn(store.getState());
  }

  set objectToSpawn(obj: ObjectToSpawn) {
    let copy = { ...obj };
    // @ts-ignore
    this.dispatch(setObjectToSpawn(copy));
  }

  spawnAt(mouse: Mouse) {
    let worldCoordinates = this.camera.mouseToWorld(mouse);
    switch (this.objectToSpawn.type) {
      case TypeOfObjectToSpawn.STAR:
        this.spawnStar(worldCoordinates.x, worldCoordinates.y);
        break;
      case TypeOfObjectToSpawn.PLANET:
        this.spawnPlanet(worldCoordinates.x, worldCoordinates.y);
        break;
    }
  }

  spawnPlanet(x: number, y: number) {
    let { mass, radius, velocity } = this.objectToSpawn;
    let planet = this.gameObjectFactory.createPlanet(
      new Vector2(x, y),
      radius,
      'textures/green_planet_1.png',
      mass
    );
    this.universe.addFreePlanet(planet);
    planet.accelerate(new Vector2(velocity.x, velocity.y));
  }

  spawnStar(x: number, y: number) {
    let { mass, radius, velocity } = this.objectToSpawn;
    let star = this.gameObjectFactory.createStar(
      radius,
      'textures/white_star_1.png',
      new Vector2(x, y),
      mass,
      'Generated star'
    );
    let solarSystem = this.gameObjectFactory.createSolarSystem([star], 2500);
    this.universe.addSolarSystem(solarSystem);
    star.accelerate(new Vector2(velocity.x, velocity.y));
  }
}
