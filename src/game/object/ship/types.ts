import { Resource } from '../Resource';
import { Vector2 } from 'three';

export enum ShipType {
  COLONY_SHIP = 'COLONY_SHIP',
  TRANSPORT_SHIP = 'TRANSPORT_SHIP',
}

export interface ShipData {
  type: ShipType;
  name: string;
  texture: string;
  cost: ShipConstructionData;
  size: Vector2;
}

type ResourceString = keyof typeof Resource;

export type ShipConstructionData = ShipCost & ShipTime;

export type ShipCost = {
  [key in ResourceString]?: number;
};

export interface ShipTime {
  time: number;
  framesPassed: number;
}
