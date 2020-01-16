import { textures } from './textures';
import { BuildingDataMap, BuildingType } from '../object/building/types';

export const BUILDINGS: BuildingDataMap = {
  [BuildingType.COLONY_CENTER]: {
    name: 'Colony center',
    type: BuildingType.COLONY_CENTER,
    texture: textures.colony_center,
  },
};
