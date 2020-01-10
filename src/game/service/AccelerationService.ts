import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { BaseObject } from '../object/BaseObject';

export class AccelerationService implements IGameService {
  private readonly objectList: ObjectList;

  constructor(objectList: ObjectList) {
    this.objectList = objectList;
  }

  update(delta: number) {
    this.objectList.allObjects.forEach(object => {
      if (object instanceof BaseObject) {
        let { velocity } = object;
        object.position.x += velocity.x * delta;
        object.position.y += velocity.y * delta;
      }
    });
  }
}
