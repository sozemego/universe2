import { Resource } from '../Resource';

export enum BuildingType {
  COLONY_CENTER = 'COLONY_CENTER',
}

export type BuildingDataMap = Record<BuildingType, BuildingData>;

export interface BuildingData {
  type: BuildingType;
  name: string;
  texture: string;
  production: BuildingProductionData;
}

type ResourceString = keyof typeof Resource;

export type BuildingProductionData = {
  [key in ResourceString]?: BuildingResourceProductionData;
};

export interface BuildingResourceProductionData {
  resource: Resource;
  produces: number; // how many of Resource it produces per minute
  timePassed: number; // seconds passed since last resource was produced
}
