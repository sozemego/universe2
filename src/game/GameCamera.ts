import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { BaseObject } from './object/BaseObject';
import { clampAbs } from '../mathUtils';
import { Universe } from './universe/Universe';
import { Mouse } from './InputHandler';

export class GameCamera extends PerspectiveCamera {
  private zoomLevel: number = 1;
  private direction: number = 0;
  private nextZoom: number = 0;
  private zoomPerSecond: number = 10000;

  update(delta: number) {
    if (this.direction === 0) {
      return;
    }
    let zoomBy = this.zoomPerSecond * 2 * delta * this.direction;
    this.position.z += zoomBy;
    if (this.direction === 1 && this.position.z >= this.nextZoom) {
      this.direction = 0;
    }
    if (this.direction === -1 && this.position.z <= this.nextZoom) {
      this.direction = 0;
    }
  }

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

  /**
   * @param direction - either 1 or -1 to signify direction
   */
  zoomInDirection(direction: number) {
    let nextZoomLevel = this.zoomLevel + direction;
    if (nextZoomLevel < 0 || nextZoomLevel > ZOOM_LEVELS.length - 1) {
      return;
    }
    this.direction = direction;
    this.nextZoom = ZOOM_LEVELS[nextZoomLevel];
    this.zoomLevel = nextZoomLevel;
    this.zoomPerSecond = Math.abs(this.position.z - this.nextZoom);
  }
}

const ZOOM_LEVELS = [2500, 5000, 10000, 25000, 100000, 175000];
