import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { Planet } from '../object/Planet';
import { Building } from '../object/building/Building';
import { BuildingFactory } from './BuildingFactory';
import { BuildingConstructionData, BuildingType } from '../object/building/types';
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
    let { id, buildings, storage, constructions } = planetData;
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
    constructions.forEach(construction => {
      let { cost } = construction;
      cost.timePassed += delta;
      if (cost.timePassed >= cost.time) {
        this.placeBuilding(this.objectList.findById(id) as Planet, construction.building);
      }
    });
    planetData.constructions = planetData.constructions.filter(
      construction => construction.cost.timePassed < construction.cost.time
    );
  }

  colonizePlanet(planet: Planet) {
    let { id } = planet;
    console.log(`Colonize planet ${id}`);
    this.planets[id] = {
      id,
      population: 5,
      buildings: [],
      storage: new PlanetStorage(50),
      constructions: [],
      planet,
    };
    this.constructBuilding(planet, BuildingType.COLONY_CENTER);
    this.constructBuilding(planet, BuildingType.FOOD_PROCESSOR);
  }

  constructBuilding(planet: Planet, buildingType: BuildingType) {
    let planetData = this.planets[planet.id];
    if (!planetData) {
      return;
    }
    let constructionData = this.buildingFactory.getBuildingConstructionData(buildingType);
    let building = this.buildingFactory.createBuilding(buildingType);
    if (constructionData.time === -1) {
      this.placeBuilding(planet, building);
    } else {
      let construction: BuildingConstruction = {
        building,
        cost: constructionData,
      };
      planetData.constructions.push(construction);
    }
  }

  placeBuilding(planet: Planet, building: Building) {
    let planetData = this.planets[planet.id];
    planetData.buildings.push(building);
    this.assignPopulation(planet);
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
  constructions: BuildingConstruction[];
}

export interface BuildingConstruction {
  cost: BuildingConstructionData;
  building: Building;
}
