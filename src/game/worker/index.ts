export interface CalcData {
  centerStar: StarData | null;
  stars: StarData[];
  planets: Record<string, PlanetData[]>;
  freePlanets: PlanetData[];
}

export interface StarData {
  id: string;
  mass: number;
  position: PositionData;
}

export interface PlanetData {
  id: string;
  mass: number;
  position: PositionData;
}

export interface PositionData {
  x: number;
  y: number;
}

export interface AccelerationData {
  x: number;
  y: number;
}

export interface GravityObject {
  id: string;
  mass: number;
  position: PositionData
}

export type ResultData = Record<string, AccelerationData>;