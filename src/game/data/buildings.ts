import { textures } from './textures';
import { BuildingDataMap, BuildingType } from '../object/building/types';
import { Resource } from '../object/Resource';

export const BUILDINGS: BuildingDataMap = {
  [BuildingType.COLONY_CENTER]: {
    name: 'Colony center',
    type: BuildingType.COLONY_CENTER,
    texture: textures.colony_center,
    production: {
      [Resource.FOOD]: {
        resource: Resource.FOOD,
        produces: 1,
        time: 60,
        timePassed: 0,
      },
      [Resource.BUILDING_MATERIAL]: {
        resource: Resource.BUILDING_MATERIAL,
        produces: 1,
        time: 120,
        timePassed: 0,
      },
    },
  },
};
