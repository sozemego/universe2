import { Color, EventDispatcher, Object3D, Vector2, Vector3 } from 'three';
import { clampAbs } from '../../mathUtils';

export class BaseObject extends EventDispatcher {
  readonly id: string;
  mass: number;
  readonly object3D: Object3D;
  texture: string;
  readonly velocity: Vector2;
  readonly color: Color;

  constructor(id: string, mass: number, object3D: Object3D, texture: string) {
    super();
    this.id = id;
    this.mass = mass;
    this.object3D = object3D;
    this.object3D.userData['objectId'] = id;
    this.texture = texture;
    this.velocity = new Vector2(0, 0);
    this.color = new Color(Math.random(), Math.random(), Math.random());
  }

  get position(): Vector3 {
    throw new Error('Implement this in a concrete class');
  }

  accelerate(acceleration: Vector2) {
    this.velocity.add(acceleration);
    this.velocity.x = clampAbs(this.velocity.x, 0, 30000);
    this.velocity.y = clampAbs(this.velocity.y, 0, 30000);
  }

  dispose() {
    this.object3D.parent?.remove(this.object3D);
  }
}
