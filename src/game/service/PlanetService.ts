import { Vector2 } from 'three';
import uuid from 'uuid/v4';
import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { Planet } from '../object/Planet';
import { Building } from '../object/building/Building';
import { BuildingFactory } from '../object/building/BuildingFactory';
import { BuildingConstructionData, BuildingType } from '../object/building/types';
import { PlanetStorage } from '../object/PlanetStorage';
import { Resource } from '../object/Resource';
import { ObjectFactory } from '../ObjectFactory';
import { textures } from '../data/textures';
import { CONSTANTS } from '../Constants';
import { Ship } from '../object/ship/Ship';
import { ShipType } from '../object/ship/types';
import { ShipFactory } from '../object/ship/ShipFactory';

export class PlanetService implements IGameService {
  private readonly objectList: ObjectList;
  private readonly objectFactory: ObjectFactory;
  private readonly shipFactory: ShipFactory;
  private readonly planets: Record<string, PlanetData> = {};
  private readonly buildingFactory: BuildingFactory = new BuildingFactory();

  constructor(objectList: ObjectList, objectFactory: ObjectFactory, shipFactory: ShipFactory) {
    this.objectList = objectList;
    this.objectFactory = objectFactory;
    this.shipFactory = shipFactory;
  }

  update(delta: number) {
    Object.values(this.planets).forEach(planetData => {
      this.updatePlanet(planetData);
    });
  }

  updatePlanet(planetData: PlanetData) {
    let { id, buildings, storage, constructions, population, populationGrowth } = planetData;
    buildings.forEach(building => {
      building.update();
      let { production } = building;
      Object.keys(production).forEach(resource => {
        let productionData = production[resource as Resource]!;
        if (productionData.timePassed === productionData.time) {
          let { produces } = productionData;
          storage.fill(resource as Resource, produces * building.population);
          productionData.timePassed = 0;
        }
      });
    });
    constructions.forEach(construction => {
      let { cost } = construction;
      cost.framesPassed += 1;
      if (cost.framesPassed >= cost.time) {
        this.placeBuilding(this.objectList.findById(id) as Planet, construction.building);
      }
    });
    planetData.constructions = planetData.constructions.filter(
      construction => construction.cost.framesPassed < construction.cost.time
    );

    planetData.populationUpkeepTime++;
    if (planetData.populationUpkeepTime === CONSTANTS.FRAMES_PER_MINUTE) {
      let foodNeeded = population.reduce((sum, pop) => sum + pop.foodUsedPerMinute, 0);
      let foodAvailable = storage.getTakenByResource(Resource.FOOD);
      let foodToConsume = Math.min(foodNeeded, foodAvailable);
      storage.removeResource(Resource.FOOD, foodToConsume);

      population.forEach(pop => {
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
    }

    populationGrowth.timePassed++;

    if (populationGrowth.time === populationGrowth.timePassed) {
      populationGrowth.timePassed = 0;
      if (populationGrowth.growing && populationGrowth.foodStored === populationGrowth.foodToGrow) {
        populationGrowth.foodStored = 0;
        populationGrowth.foodConsumedPerMinute = 1;
        populationGrowth.foodToGrow = population.length;
        populationGrowth.growing = false;
        population.push(this._createPopulationUnit());
        this.assignPopulation(planetData.planet);
      }

      populationGrowth.growing =
        storage.getTakenByResource(Resource.FOOD) >= populationGrowth.foodConsumedPerMinute;
      if (populationGrowth.growing) {
        storage.removeResource(Resource.FOOD, populationGrowth.foodConsumedPerMinute);
        populationGrowth.foodStored += populationGrowth.foodConsumedPerMinute;
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
        foodConsumedPerMinute: 1,
        growing: false,
        time: CONSTANTS.FRAMES_PER_MINUTE,
        timePassed: 0,
      },
      buildings: [],
      storage: new PlanetStorage(500),
      constructions: [],
      planet,
      populationUpkeepTime: 0,
      ships: [],
    };
    this.placeBuilding(planet, this.buildingFactory.createBuilding(BuildingType.COLONY_CENTER));
    this.placeBuilding(planet, this.buildingFactory.createBuilding(BuildingType.SHIPYARD));
    this.constructShip(planet, ShipType.TRANSPORT_SHIP);
    this.constructShip(planet, ShipType.TRANSPORT_SHIP);
    this.constructShip(planet, ShipType.COLONY_SHIP);
    this.planets[id].storage.fill(Resource.BUILDING_MATERIAL, 25);
    this.planets[id].storage.fill(Resource.FOOD, 50);

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
    for (let i = 0; i < 5; i++) {
      populationUnits.push(this._createPopulationUnit());
    }
    return populationUnits;
  }

  _createPopulationUnit() {
    return {
      id: uuid(),
      framesPassed: 0,
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
        if (building.population < building.maxPopulation) {
          building.population += 1;
          break;
        }
      }
    }
  }

  getPlanetData(id: string): PlanetData | null {
    return this.planets[id] || null;
  }

  constructShip(planet: Planet | PlanetData, shipType: ShipType) {
    if (planet instanceof Planet) {
      planet = this.planets[planet.id];
    }
    let ship = this.shipFactory.createShip(shipType);
    this.dockShip(planet, ship);
  }

  launchShip(planet: Planet, ship: Ship) {
    let planetData = this.planets[planet.id];
    if (!planetData) {
      return;
    }
    let { ships } = planetData;
    let index = ships.findIndex(s => s === ship);
    if (index > -1) {
      ships.splice(index, 1);
      ship.visible = true;
      ship.position.x = planet.position.x;
      ship.position.y = planet.position.y;
      ship.planet = null;
    }
  }

  dockShip(planet: Planet | PlanetData, ship: Ship) {
    if (planet instanceof Planet) {
      ship.planet = planet;
      planet = this.planets[planet.id];
    } else {
      ship.planet = planet.planet;
    }
    ship.visible = false;
    planet.ships.push(ship);
  }
}

export interface PlanetData {
  id: string;
  population: PlanetPopulationUnit[];
  populationUpkeepTime: number;
  populationGrowth: PopulationGrowth;
  buildings: Building[];
  storage: PlanetStorage;
  constructions: BuildingConstruction[];
  planet: Planet;
  ships: Ship[];
}

export interface PlanetPopulationUnit {
  id: string;
  foodUsedPerMinute: number;
}

export interface PopulationGrowth {
  growing: boolean;
  foodToGrow: number;
  foodStored: number;
  foodConsumedPerMinute: number;
  time: number;
  timePassed: number;
}

export interface BuildingConstruction {
  cost: BuildingConstructionData;
  building: Building;
}
