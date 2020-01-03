import { PerspectiveCamera, Vector2 } from 'three';
import { BaseObject } from './object/BaseObject';
import { clampAbs } from '../mathUtils';
import { Universe } from './Universe';

export class GameCamera extends PerspectiveCamera {
  moveTo(position: Vector2) {
    this.position.x = position.x;
    this.position.y = position.y;
  }

  moveToObject(object: BaseObject) {
    this.moveTo(new Vector2(object.position.x, object.position.y));
    this.position.z = 5000;
  }

  updateProjectionMatrix(): void {
    super.updateProjectionMatrix();
    this.position.z = clampAbs(this.position.z, 0, Universe.MAX_CAMERA_Z);
  }
}
