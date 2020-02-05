import uuid from 'uuid/v4';
import { Vector2 } from 'three';
import { ObjectFactory } from '../../ObjectFactory';
import { ShipData, ShipType } from './types';
import { Ship } from './Ship';
import { SHIPS } from '../../data/ships';
import { ObjectList } from '../../ObjectList';

export class ShipFactory {
  private readonly objectList: ObjectList;
  private readonly objectFactory: ObjectFactory;

  constructor(objectList: ObjectList, objectFactory: ObjectFactory) {
    this.objectList = objectList;
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
    let ship = new Ship(id, data.name, data.texture, shipType, sprite);
    this.objectList.addObject(ship);
    return ship;
  }
}
