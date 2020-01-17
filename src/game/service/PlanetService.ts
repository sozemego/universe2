import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { Planet } from '../object/Planet';
import { Building } from '../object/building/Building';
import { BuildingFactory } from './BuildingFactory';
import { BuildingType } from '../object/building/types';
import { PlanetStorage } from '../object/PlanetStorage';

export class PlanetService implements IGameService {
  private readonly objectList: ObjectList;
  private readonly planets: Record<string, PlanetData> = {};
  private readonly buildingFactory: BuildingFactory = new BuildingFactory();

  constructor(objectList: ObjectList) {
    this.objectList = objectList;
  }

  update(delta: number) {
    Object.values(this.planets).forEach(planetData => {
      let { buildings } = planetData;
      buildings.forEach(building => building.update(delta));
    });
  }

  colonizePlanet(planet: Planet) {
    let { id } = planet;
    console.log(`Colonize planet ${id}`);
    this.planets[id] = {
      id,
      population: 5,
      buildings: [this.buildingFactory.createBuilding(BuildingType.COLONY_CENTER, planet)],
      storage: new PlanetStorage(50),
    };
  }

  getPlanetData(id: string): PlanetData | null {
    return this.planets[id] || null;
  }
}

export interface PlanetData {
  id: string;
  population: number;
  buildings: Building[];
  storage: PlanetStorage;
}
