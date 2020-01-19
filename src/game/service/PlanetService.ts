import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { Planet } from '../object/Planet';
import { Building } from '../object/building/Building';
import { BuildingFactory } from './BuildingFactory';
import { BuildingType } from '../object/building/types';
import { PlanetStorage } from '../object/PlanetStorage';
import { Resource } from '../object/Resource';

export class PlanetService implements IGameService {
  private readonly objectList: ObjectList;
  private readonly planets: Record<string, PlanetData> = {};
  private readonly buildingFactory: BuildingFactory = new BuildingFactory();

  constructor(objectList: ObjectList) {
    this.objectList = objectList;
  }

  update(delta: number) {
    Object.values(this.planets).forEach(planetData => {
      this.updatePlanet(planetData, delta);
    });
  }

  updatePlanet(planetData: PlanetData, delta: number) {
    let { buildings, storage } = planetData;
    buildings.forEach(building => {
      building.update(delta);
      let { production } = building;
      Object.keys(production).forEach(resource => {
        let productionData = production[resource as Resource]!;
        let { produces, timePassed } = productionData;
        if (timePassed >= 60) {
          productionData.timePassed = 0;
          storage.fill(resource as Resource, produces);
        }
      });
    });
  }

  colonizePlanet(planet: Planet) {
    let { id } = planet;
    console.log(`Colonize planet ${id}`);
    this.planets[id] = {
      id,
      population: 5,
      buildings: [],
      storage: new PlanetStorage(50),
    };
    this.constructBuilding(planet, BuildingType.COLONY_CENTER);
    this.assignPopulation(planet);
  }

  constructBuilding(planet: Planet, buildingType: BuildingType) {
    let planetData = this.planets[planet.id];
    if (!planetData) {
      return;
    }
    let building = this.buildingFactory.createBuilding(buildingType);
    planetData.buildings.push(building);
  }

  assignPopulation(planet: Planet) {
    let planetData = this.planets[planet.id];
    if (!planetData) {
      return;
    }
    let { buildings, population } = planetData;
    buildings.forEach(building => (building.population = 0));
    for (let i = 0; i < population; i++) {
      for (let j = 0; j < buildings.length; j++) {
        let building = buildings[j];
        if (building.population < building.populationNeeded) {
          building.population += 1;
          break;
        }
      }
    }
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
