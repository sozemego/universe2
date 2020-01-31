import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { Planet } from '../object/Planet';
import { Building } from '../object/building/Building';
import { BuildingFactory } from './BuildingFactory';
import { BuildingConstructionData, BuildingType } from '../object/building/types';
import { PlanetStorage } from '../object/PlanetStorage';
import { Resource } from '../object/Resource';
import { ObjectFactory } from '../ObjectFactory';
import { Vector2 } from 'three';
import { textures } from '../data/textures';

export class PlanetService implements IGameService {
  private readonly objectList: ObjectList;
  private readonly objectFactory: ObjectFactory;
  private readonly planets: Record<string, PlanetData> = {};
  private readonly buildingFactory: BuildingFactory = new BuildingFactory();

  constructor(objectList: ObjectList, objectFactory: ObjectFactory) {
    this.objectList = objectList;
    this.objectFactory = objectFactory;
  }

  update(delta: number) {
    Object.values(this.planets).forEach(planetData => {
      this.updatePlanet(planetData, delta);
    });
  }

  updatePlanet(planetData: PlanetData, delta: number) {
    let { id, buildings, storage, constructions, population } = planetData;
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

    population.timePassed += delta;
    let canConsume = population.timePassed >= 60;
    let hasEnoughFood =
      storage.getTakenByResource(Resource.FOOD) >= population.foodConsumedPerMinute;
    if (canConsume && hasEnoughFood) {
      population.foodAccumulated += population.foodConsumedPerMinute;
      population.timePassed = 0;
      storage.removeResource(Resource.FOOD, population.foodConsumedPerMinute);
      if (population.foodAccumulated === population.foodNeeded) {
        population.count += 1;
        population.foodAccumulated = 0;
        population.foodConsumedPerMinute = 1;
        population.foodNeeded = population.count;
        this.assignPopulation(planetData.planet);
      }
    }
  }

  colonizePlanet(planet: Planet) {
    let { id } = planet;
    console.log(`Colonize planet ${id}`);
    this.planets[id] = {
      id,
      population: {
        count: 5,
        foodAccumulated: 0,
        foodConsumedPerMinute: 1,
        foodNeeded: 5,
        timePassed: 0,
      },
      buildings: [],
      storage: new PlanetStorage(50),
      constructions: [],
      planet,
    };
    this.constructBuilding(planet, BuildingType.COLONY_CENTER);
    this.constructBuilding(planet, BuildingType.FOOD_PROCESSOR);
    this.planets[id].storage.fill(Resource.BUILDING_MATERIAL, 10);

    let sprite = this.objectFactory.createSprite(
      textures.colony_center,
      new Vector2(-0.5, 0.75),
      0.25,
      0.25
    );
    planet.object3D.add(sprite);
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
      let { storage } = planetData;
      let canAfford = this.checkCanAfford(constructionData, storage);
      if (canAfford) {
        let construction: BuildingConstruction = {
          building,
          cost: constructionData,
        };
        planetData.constructions.push(construction);
        Object.values(Resource).forEach(resource => {
          let cost = constructionData[resource as Resource] || 0;
          storage.removeResource(resource as Resource, cost);
        });
      }
    }
  }

  checkCanAfford(data: BuildingConstructionData, storage: PlanetStorage): boolean {
    let resources: string[] = Object.values(Resource);
    for (let resource of resources) {
      let cost = data[resource as Resource] || 0;
      let amount = storage.getTakenByResource(resource as Resource);
      if (cost > amount) {
        return false;
      }
    }
    return true;
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
    for (let i = 0; i < population.count; i++) {
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
  population: PlanetPopulation;
  buildings: Building[];
  storage: PlanetStorage;
  constructions: BuildingConstruction[];
  planet: Planet;
}

export interface PlanetPopulation {
  count: number;
  foodNeeded: number;
  foodConsumedPerMinute: number;
  foodAccumulated: number;
  timePassed: number;
}

export interface BuildingConstruction {
  cost: BuildingConstructionData;
  building: Building;
}
