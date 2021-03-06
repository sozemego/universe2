import {
  BufferGeometry,
  Camera,
  Geometry,
  Group,
  Material,
  Object3D,
  Scene,
  Sprite,
  WebGLRenderer,
} from 'three';
import { clampAbs } from '../../mathUtils';
import { Universe } from '../universe/Universe';

export function scaleToCamera(maxScale: number) {
  return function scaleToCamera(
    this: Object3D,
    renderer: WebGLRenderer,
    scene: Scene,
    camera: Camera,
    geometry: Geometry | BufferGeometry,
    material: Material,
    group: Group
  ) {
    const cameraDistanceFromPlane = camera.position.z;
    let scale = maxScale * (cameraDistanceFromPlane / Universe.MAX_CAMERA_Z);
    if (scale < 1) {
      scale = 1;
    }
    scale = clampAbs(scale, 1, maxScale);
    if (this instanceof Sprite) {
      let baseScaleX = this.userData['width'] as number;
      let baseScaleY = this.userData['height'] as number;
      this.scale.x = baseScaleX * scale;
      this.scale.y = baseScaleY * scale;
    } else {
      this.scale.x = scale;
      this.scale.y = scale;
      this.scale.z = scale;
    }
  };
}

export function scaleToCameraDefault() {
  return scaleToCamera(25);
}

export function scaleToCameraDistance(maxScale: number) {
  return scaleToCamera(maxScale);
}

/**
 * Finds the position of the <code>current</code> object
 * in given array <code>arr</code> and returns the next object
 * in that array, wrapping to the first one if <code>current</code>
 * is last.
 */
export function next(current: any, arr: any[]) {
  const index = arr.findIndex(obj => obj === current);
  const nextIndex = (index + 1) % arr.length;
  return arr[nextIndex];
}

export function calcDistance(obj1: HasPosition, obj2: HasPosition): number {
  let deltaX = obj1.position.x - obj2.position.x;
  let deltaY = obj1.position.y - obj2.position.y;
  let distanceSquared = deltaX * deltaX + deltaY * deltaY;
  return Math.sqrt(distanceSquared);
}

export interface HasPosition {
  position: {
    x: number;
    y: number;
  };
}
