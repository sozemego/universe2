import { BaseObject } from './BaseObject';
import { Sphere, Sprite } from 'three';
import { SolarSystem } from './SolarSystem';

export class Star extends BaseObject {
  sphere: Sphere;
  solarSystem: SolarSystem | null;
  name: string;

  constructor(
    id: string,
    sphere: Sphere,
    mass: number,
    sprite: Sprite,
    name: string,
    texture: string
  ) {
    super(id, mass, sprite, texture);
    this.sphere = sphere;
    this.solarSystem = null;
    this.name = name;
  }

  get position() {
    return this.sphere.center;
  }

  get radius() {
    return this.sphere.radius;
  }

  update(delta: number) {
    this.object3D.position.x = this.sphere.center.x;
    this.object3D.position.y = this.sphere.center.y;
  }

  dispose() {
    super.dispose();
    this.dispatchEvent({ type: 'remove' });
  }
}
