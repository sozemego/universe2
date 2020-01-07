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
import { MainThreadGravityService } from '../game/service/MainThreadGravityService';
import { AccelerationService } from '../game/service/AccelerationService';
import { Universe } from '../game/universe/Universe';
import { Star } from '../game/object/Star';
import { Planet } from '../game/object/Planet';
import { SolarSystem } from '../game/object/SolarSystem';

const electron = eval('require')('electron');
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
    new MainThreadGravityService(universe),
    new AccelerationService(objectList),
  ];

  const gameService = new GameService(
    engine,
    input,
    objectList,
    selectionService,
    universe,
    gameOptions,
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
  let freePlanetsData: PlanetData[] = universe.freePlanets.map(getPlanetData);
  let solarSystemsData: SolarSystemData[] = universe.solarSystems.map(getSolarSystemData);
  let universeData: UniverseData = {
    centerStar: centerStarData,
    solarSystems: solarSystemsData,
    freePlanets: freePlanetsData,
  };
  let str = JSON.stringify(universeData, null, 2);
  fs.writeFileSync(fileName, str);
}

function getSolarSystemData(solarSystem: SolarSystem): SolarSystemData {
  return {
    star: getStarData(solarSystem.star),
    planets: solarSystem.planets.map(getPlanetData),
  };
}

function getStarData(star: Star): StarData {
  return {
    id: star.id,
    mass: star.mass,
    position: { x: star.position.x, y: star.position.y },
    acceleration: { x: star.acceleration.x, y: star.acceleration.y },
  };
}

function getPlanetData(planet: Planet): PlanetData {
  return {
    id: planet.id,
    mass: planet.mass,
    position: { x: planet.position.x, y: planet.position.y },
    acceleration: { x: planet.acceleration.x, y: planet.acceleration.y },
  };
}

interface UniverseData {
  centerStar: StarData;
  solarSystems: SolarSystemData[];
  freePlanets: PlanetData[];
}

interface SolarSystemData {
  star: StarData;
  planets: PlanetData[];
}

interface StarData {
  id: string;
  mass: number;
  position: Vector2Data;
  acceleration: Vector2Data;
}

interface PlanetData {
  id: string;
  mass: number;
  position: Vector2Data;
  acceleration: Vector2Data;
}

interface Vector2Data {
  x: number;
  y: number;
}
