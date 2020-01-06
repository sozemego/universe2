import { Line, Material, Sphere, Vector2, Vector3 } from 'three';
import { Star } from './Star';
import { Planet } from './Planet';

export class SolarSystem {
  readonly star: Star;
  readonly planets: Planet[];
  radius: number;
  private readonly ring: Line;

  constructor(radius: number, star: Star, ring: Line) {
    this.radius = radius;
    this.star = star;
    this.star.solarSystem = this;
    this.ring = ring;
    this.planets = [];
  }

  get position() {
    return this.star.position;
  }

  get sphere() {
    return new Sphere(new Vector3(this.position.x, this.position.y, 0), this.radius);
  }

  update(delta: number) {
    this.ring.position.x = this.position.x;
    this.ring.position.y = this.position.y;
    this.star.update(delta);
    this.planets.forEach(planet => planet.update(delta));
  }

  dispose() {
    if (this.ring.material instanceof Material) {
      this.ring.material.dispose();
    }
    this.ring.geometry.dispose();
    this.ring.parent?.remove(this.ring);
    this.star.dispose();
    this.planets.forEach(p => p.dispose());
  }

  addPlanet(planet: Planet) {
    this.planets.push(planet);
    planet.solarSystem = this;
  }

  removePlanet(planet: Planet) {
    const index = this.planets.findIndex(p => p === planet);
    if (index > -1) {
      this.planets.splice(index, 1);
    }
  }

  accelerate(acceleration: Vector2) {
    this.star.accelerate(acceleration);
    this.planets.forEach(planet => planet.accelerate(acceleration));
  }
}
