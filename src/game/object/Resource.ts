import { textures } from '../data/textures';

export enum Resource {
  FOOD = 'FOOD',
  METAL = 'METAL',
  BUILDING_MATERIAL = 'BUILDING_MATERIAL',
}

type ResourceString = keyof typeof Resource;

export type ResourceDataMap = {
  [key in ResourceString]: ResourceData;
};

export const RESOURCE_DATA: ResourceDataMap = {
  [Resource.FOOD]: {
    name: 'Food',
    texture: textures.food,
  },
  [Resource.BUILDING_MATERIAL]: {
    name: 'Building material',
    texture: textures.building_material,
  },
  [Resource.METAL]: {
    name: 'Metal',
    texture: textures.metal,
  },
};

export interface ResourceData {
  name: string;
  texture: string;
}
