import {
  BufferGeometry,
  Camera,
  Geometry,
  Group,
  Material,
  Object3D,
  Scene,
  Sprite,
  Vector2,
  WebGLRenderer,
} from 'three';
import { clampAbs } from '../../mathUtils';
import { Universe } from '../universe/Universe';
import { BaseObject } from '../object/BaseObject';

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

export function calcDistance(obj1: BaseObject, obj2: BaseObject): number {
  return new Vector2(obj1.position.x, obj1.position.y).distanceTo(
    new Vector2(obj2.position.x, obj2.position.y)
  );
}
