import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { BaseObject } from './object/BaseObject';
import { clampAbs } from '../mathUtils';
import { Universe } from './universe/Universe';
import { Mouse } from './InputHandler';

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

  mouseToWorld(mouse: Mouse) {
    let vec = new Vector3(mouse.x, mouse.y, 0);
    vec.unproject(this);
    vec.sub(this.position).normalize();

    let distance = -this.position.z / vec.z;
    let position = new Vector3();
    position.copy(this.position).add(vec.multiplyScalar(distance));
    return position;
  }
}
