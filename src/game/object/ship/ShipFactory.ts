import uuid from 'uuid/v4';
import { Vector2 } from 'three';
import { ObjectFactory } from '../../ObjectFactory';
import { ShipData, ShipType } from './types';
import { Ship } from './Ship';
import { SHIPS } from '../../data/ships';

export class ShipFactory {
  private readonly objectFactory: ObjectFactory;

  constructor(objectFactory: ObjectFactory) {
    this.objectFactory = objectFactory;
  }

  createShip(shipType: ShipType): Ship {
    let data = JSON.parse(JSON.stringify(SHIPS[shipType])) as ShipData;
    let id = uuid();
    let sprite = this.objectFactory.createSprite(
      data.texture,
      new Vector2(),
      data.size.x,
      data.size.y
    );
    return new Ship(id, data.name, data.texture, sprite);
  }
}
