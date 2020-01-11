import { BaseObject } from './BaseObject';
import { SolarSystem } from './SolarSystem';
import { Sphere, Sprite } from 'three';

export class Planet extends BaseObject {
  sphere: Sphere;
  solarSystem: SolarSystem | null;
  orbitalDistance: number = 0;
  angularVelocity: number = 0;

  constructor(
    id: string,
    sphere: Sphere,
    mass: number,
    sprite: Sprite,
    texture: string,
    solarSystem: SolarSystem | null
  ) {
    super(id, mass, sprite, texture);
    this.sphere = sphere;
    this.solarSystem = solarSystem;
  }

  update(delta: number) {
    this.object3D.position.x = this.sphere.center.x;
    this.object3D.position.y = this.sphere.center.y;
  }

  dispose() {
    super.dispose();
    if (this.solarSystem) {
      this.solarSystem.removePlanet(this);
    }
    this.dispatchEvent({ type: 'remove' });
  }

  get position() {
    return this.sphere.center;
  }

  get radius() {
    return this.sphere.radius;
  }
}
