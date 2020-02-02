import { Resource } from '../Resource';

export enum BuildingType {
  COLONY_CENTER = 'COLONY_CENTER',
  HOUSING = 'HOUSING',
  FOOD_PROCESSOR = 'FOOD PROCESSOR',
}

export type BuildingDataMap = Record<BuildingType, BuildingData>;

export interface BuildingData {
  type: BuildingType;
  name: string;
  texture: string;
  production: BuildingProductionData;
  populationNeeded: number;
  description: string;
  cost: BuildingConstructionData;
}

type ResourceString = keyof typeof Resource;

export type BuildingProductionData = {
  [key in ResourceString]?: BuildingResourceProductionData;
};

export interface BuildingResourceProductionData {
  resource: Resource;
  produces: number;
}

export type BuildingConstructionData = BuildingCost & BuildingTime;

export type BuildingCost = {
  [key in ResourceString]?: number;
};

export interface BuildingTime {
  time: number;
  framesPassed: number;
}
