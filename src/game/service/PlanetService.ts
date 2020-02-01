import { Vector2 } from 'three';
import uuid from 'uuid/v4';
import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { Planet } from '../object/Planet';
import { Building } from '../object/building/Building';
import { BuildingFactory } from './BuildingFactory';
import { BuildingConstructionData, BuildingType } from '../object/building/types';
import { PlanetStorage } from '../object/PlanetStorage';
import { Resource } from '../object/Resource';
import { ObjectFactory } from '../ObjectFactory';
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
    let { id, buildings, storage, constructions, population, populationGrowth } = planetData;
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

    population.forEach(pop => (pop.timePassed += delta));
    let finishedPopulations = population.filter(pop => pop.timePassed >= 60);
    let foodNeeded = finishedPopulations.reduce((sum, pop) => sum + pop.foodUsedPerMinute, 0);
    let foodAvailable = storage.getTakenByResource(Resource.FOOD);
    let foodToConsume = Math.min(foodNeeded, foodAvailable);

    storage.removeResource(Resource.FOOD, foodToConsume);

    finishedPopulations.forEach(pop => {
      if (foodToConsume >= pop.foodUsedPerMinute) {
        foodToConsume -= pop.foodUsedPerMinute;
      } else {
        let index = population.findIndex(population => population === pop);
        if (index > -1) {
          population.splice(index, 1);
          this.assignPopulation(planetData.planet);
        }
      }
    });
    population.forEach(pop => (pop.timePassed = pop.timePassed >= 60 ? 0 : pop.timePassed));

    populationGrowth.timePassed += delta;
    let canConsume = populationGrowth.timePassed >= 60;
    let hasEnoughFood =
      storage.getTakenByResource(Resource.FOOD) >= populationGrowth.foodConsumedPerMinute;
    if (canConsume && hasEnoughFood) {
      populationGrowth.foodStored += populationGrowth.foodConsumedPerMinute;
      populationGrowth.timePassed = 0;
      storage.removeResource(Resource.FOOD, populationGrowth.foodConsumedPerMinute);
      if (populationGrowth.foodStored === populationGrowth.foodToGrow) {
        populationGrowth.foodStored = 0;
        populationGrowth.foodConsumedPerMinute = 1;
        populationGrowth.foodToGrow = population.length;
        population.push(this._createPopulationUnit());
        this.assignPopulation(planetData.planet);
      }
    }
  }

  colonizePlanet(planet: Planet) {
    let { id } = planet;
    console.log(`Colonize planet ${id}`);
    this.planets[id] = {
      id,
      population: this.initialPopulation(),
      populationGrowth: {
        foodStored: 0,
        foodToGrow: 5,
        timePassed: 0,
        foodConsumedPerMinute: 1,
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

  initialPopulation(): PlanetPopulationUnit[] {
    let populationUnits: PlanetPopulationUnit[] = [];
    for (let i = 0; i < 15; i++) {
      populationUnits.push(this._createPopulationUnit());
    }
    return populationUnits;
  }

  _createPopulationUnit() {
    return {
      id: uuid(),
      timePassed: 0,
      foodUsedPerMinute: 1,
    };
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
    for (let i = 0; i < population.length; i++) {
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
  population: PlanetPopulationUnit[];
  populationGrowth: PopulationGrowth;
  buildings: Building[];
  storage: PlanetStorage;
  constructions: BuildingConstruction[];
  planet: Planet;
}

export interface PlanetPopulationUnit {
  id: string;
  foodUsedPerMinute: number;
  timePassed: number;
}

export interface PopulationGrowth {
  foodToGrow: number;
  foodStored: number;
  foodConsumedPerMinute: number;
  timePassed: number;
}

export interface BuildingConstruction {
  cost: BuildingConstructionData;
  building: Building;
}
