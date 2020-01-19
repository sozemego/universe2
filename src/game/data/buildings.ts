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
        produces: 1,
        timePassed: 0,
      },
      [Resource.BUILDING_MATERIAL]: {
        resource: Resource.BUILDING_MATERIAL,
        produces: 0.5,
        timePassed: 0,
      },
    },
  },
};
