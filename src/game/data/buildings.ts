import { textures } from './textures';
import { BuildingDataMap, BuildingType } from '../object/building/types';
import { Resource } from '../object/Resource';

export const BUILDINGS: BuildingDataMap = {
  [BuildingType.COLONY_CENTER]: {
    name: 'Colony center',
    type: BuildingType.COLONY_CENTER,
    texture: textures.colony_center,
    populationNeeded: 2,
    description: 'Colony center serves as a administrative nexus for growing colonies.',
    production: {
      [Resource.FOOD]: {
        resource: Resource.FOOD,
        produces: 6,
        timePassed: 0,
      },
      [Resource.BUILDING_MATERIAL]: {
        resource: Resource.BUILDING_MATERIAL,
        produces: 2,
        timePassed: 0,
      },
    },
    cost: {
      time: -1,
      timePassed: 0,
    },
  },
  [BuildingType.HOUSING]: {
    name: 'Housing',
    type: BuildingType.HOUSING,
    texture: textures.housing,
    populationNeeded: 0,
    description: "Provides housing for this planet's ever increasing population.",
    production: {},
    cost: {
      [Resource.BUILDING_MATERIAL]: 15,
      time: 240,
      timePassed: 0,
    },
  },
  [BuildingType.FOOD_PROCESSOR]: {
    name: 'Food processor',
    type: BuildingType.FOOD_PROCESSOR,
    texture: textures.food_processor,
    populationNeeded: 4,
    description: 'Exploits natural resources to provide food for your people.',
    production: {
      [Resource.FOOD]: {
        resource: Resource.FOOD,
        produces: 3,
        timePassed: 0,
      },
    },
    cost: {
      [Resource.BUILDING_MATERIAL]: 25,
      time: 360,
      timePassed: 0,
    },
  },
};
