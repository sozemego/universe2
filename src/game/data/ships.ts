import { ShipData, ShipType } from '../object/ship/types';
import { Vector2 } from 'three';
import { Resource } from '../object/Resource';
import { textures } from './textures';

export const SHIPS: ShipDataMap = {
  [ShipType.COLONY_SHIP]: {
    name: 'Colony ship',
    type: ShipType.COLONY_SHIP,
    size: new Vector2(24, 24),
    texture: textures.colony_ship,
    cost: {
      [Resource.METAL]: 25,
      time: 0,
      framesPassed: 0,
    },
  },
  [ShipType.TRANSPORT_SHIP]: {
    name: 'Transport ship',
    type: ShipType.TRANSPORT_SHIP,
    size: new Vector2(18, 18),
    texture: textures.transport_ship,
    cost: {
      [Resource.METAL]: 10,
      time: 0,
      framesPassed: 0,
    },
  },
};

export type ShipDataMap = Record<ShipType, ShipData>;
