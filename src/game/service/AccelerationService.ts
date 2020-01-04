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
        let { acceleration } = object;
        object.position.x += acceleration.x * delta;
        object.position.y += acceleration.y * delta;
      }
    });
  }
}
