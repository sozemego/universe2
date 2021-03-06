import { GameService } from '../game/GameService';
import { createInputHandler } from '../game/InputHandler';
import { GameEngine } from '../game/GameEngine';
import { Scene } from 'three';
import { GameCamera } from '../game/GameCamera';
import { ObjectList } from '../game/ObjectList';
import { SelectionService } from '../game/service/SelectionService';
import { SelectionContainer } from '../game/SelectionContainer';
import { Dispatch } from 'redux';
import { GameOptions } from '../game/GameOptions';
import { IGameService } from '../game/service';
import { UniverseGenerator } from '../game/universe/UniverseGenerator';
import { GameObjectFactory } from '../game/GameObjectFactory';
import { ObjectFactory } from '../game/ObjectFactory';
import { CollisionService } from '../game/service/CollisionService';
import { GravityService } from '../game/service/GravityService';
import { AccelerationService } from '../game/service/AccelerationService';
import { Universe } from '../game/universe/Universe';
import { Star } from '../game/object/Star';
import { Planet } from '../game/object/Planet';
import { SolarSystem } from '../game/object/SolarSystem';

// eslint-disable-next-line no-eval
const electron = eval('require')('electron');
// eslint-disable-next-line no-eval
const fs = eval('require')('fs');

export function runScenario() {
  console.log('Running future gravity scenario!');

  const element = document.createElement('div');
  const input = createInputHandler(element);
  const scene = new Scene();
  const camera = new GameCamera();
  const engine = new GameEngine(element, scene, input, camera);
  const objectList = new ObjectList();
  const dispatch: Dispatch = (arg: any) => arg;
  const selectionContainer = new SelectionContainer(dispatch);
  const selectionService = new SelectionService(selectionContainer, objectList);
  const objectFactory = new ObjectFactory(scene);
  const gameObjectFactory = new GameObjectFactory(objectList, objectFactory, selectionContainer);
  const universe = new UniverseGenerator(gameObjectFactory).generateUniverse();
  const gameOptions = new GameOptions(dispatch);

  const services: IGameService[] = [
    new CollisionService(universe, selectionContainer),
    new GravityService(universe),
    new AccelerationService(objectList),
  ];

  const gameService = new GameService(
    engine,
    input,
    objectList,
    selectionService,
    universe,
    gameOptions,
    dispatch,
    services
  );
  writeToFile('output/start.txt', universe);

  console.log('Running the simulation for 60 minutes');
  let time = 1 * 60 * 60;
  let delta = 1 / 10;
  while (time >= 0) {
    time -= delta;
    gameService.update(delta);
  }
  writeToFile('output/result.txt', universe);

  electron.remote.getCurrentWindow().close();
}

function writeToFile(fileName: string, universe: Universe) {
  let centerStarData: StarData = getStarData(universe.centerStar);
  let solarSystemsData: SolarSystemData[] = universe.solarSystems.map(getSolarSystemData);
  let universeData: UniverseData = {
    centerStar: centerStarData,
    solarSystems: solarSystemsData,
  };
  let str = JSON.stringify(universeData, null, 2);
  fs.writeFileSync(fileName, str);
}

function getSolarSystemData(solarSystem: SolarSystem): SolarSystemData {
  return {
    stars: solarSystem.stars.map(star => getStarData(star)),
    planets: solarSystem.planets.map(getPlanetData),
  };
}

function getStarData(star: Star): StarData {
  return {
    id: star.id,
    mass: star.mass,
    position: { x: star.position.x, y: star.position.y },
    velocity: { x: star.velocity.x, y: star.velocity.y },
  };
}

function getPlanetData(planet: Planet): PlanetData {
  return {
    id: planet.id,
    mass: planet.mass,
    position: { x: planet.position.x, y: planet.position.y },
    velocity: { x: planet.velocity.x, y: planet.velocity.y },
  };
}

interface UniverseData {
  centerStar: StarData;
  solarSystems: SolarSystemData[];
}

interface SolarSystemData {
  stars: StarData[];
  planets: PlanetData[];
}

interface StarData {
  id: string;
  mass: number;
  position: Vector2Data;
  velocity: Vector2Data;
}

interface PlanetData {
  id: string;
  mass: number;
  position: Vector2Data;
  velocity: Vector2Data;
}

interface Vector2Data {
  x: number;
  y: number;
}
