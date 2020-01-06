import { Line } from 'three';
import { ObjectList } from '../ObjectList';
import { ObjectFactory } from '../ObjectFactory';
import { IGameService } from './index';
import { InputHandler, KEY } from '../InputHandler';
import { Planet } from '../object/Planet';
import { Star } from '../object/Star';
import { GameOptions } from "../GameOptions";

export class ObjectBoundsService implements IGameService {
  private readonly objectList: ObjectList;
  private readonly objectFactory: ObjectFactory;
  private readonly input: InputHandler;
  private readonly options: GameOptions;

  constructor(objectList: ObjectList, objectFactory: ObjectFactory, input: InputHandler, options: GameOptions) {
    this.objectList = objectList;
    this.objectFactory = objectFactory;
    this.input = input;
    this.options = options;
    this.input.onKeyDown(({key}) => {
      if (key === KEY.K && !this.options.showDebugSphereBounds) {
        this.setVisibilityOfSphereBounds(true);
        return true;
      }
    });
    this.input.onKeyUp(({key}) => {
      if (key === KEY.K && this.options.showDebugSphereBounds) {
        this.setVisibilityOfSphereBounds(false);
        return true;
      }
    });
  }

  update(delta: number) {
    if (!this.options.showDebugSphereBounds) {
      return;
    }
    this.objectList.allObjects.forEach(obj => {
      if (obj instanceof Star || obj instanceof Planet) {
        let hasCircleBoundsAttached = obj.object3D.userData['sphereBoundsId'];
        if (!hasCircleBoundsAttached) {
          let bounds = this.getBounds(obj);
          obj.object3D.add(bounds);
          obj.object3D.userData['sphereBoundsId'] = bounds.id;
        }
      }
    });
  }

  setVisibilityOfSphereBounds(visible: boolean) {
    this.options.showDebugSphereBounds = visible;
    this.objectList.allObjects.forEach(obj => {
      if (obj instanceof Star || obj instanceof Planet) {
        let sphereBoundsId = obj.object3D.userData['sphereBoundsId'] as number;
        if (sphereBoundsId) {
          let bounds = obj.object3D.getObjectById(sphereBoundsId);
          if (bounds) {
            bounds.visible = visible;
          }
        }
      }
    });
  }

  getBounds(obj: Planet | Star): Line {
    return this.objectFactory.createCircle(0.5, obj.color);
  }
}
