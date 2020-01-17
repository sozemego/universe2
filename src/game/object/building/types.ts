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
  produces: number;
  time: number; // seconds
  timePassed: number; // seconds passed since last resource was produced
}
