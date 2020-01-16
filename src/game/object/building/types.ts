export enum BuildingType {
  COLONY_CENTER = 'COLONY_CENTER',
}

export type BuildingDataMap = Record<BuildingType, BuildingData>;

export interface BuildingData {
  type: BuildingType;
  name: string;
  texture: string;
}
