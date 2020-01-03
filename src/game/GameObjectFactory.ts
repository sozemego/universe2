import { ObjectList } from './ObjectList';
import { ObjectFactory } from './ObjectFactory';
import { scaleToCameraDefault, scaleToCameraDistance } from './util/utils';
import { Star } from './object/Star';
import uuid from 'uuid/v4';
import { Color, Points, Sphere, Vector2, Vector3 } from 'three';
import { SolarSystem } from './object/SolarSystem';
import { Planet } from './object/Planet';

export class GameObjectFactory {
  private readonly objectList: ObjectList;
  private readonly objectFactory: ObjectFactory;

  constructor(objectList: ObjectList, objectFactory: ObjectFactory) {
    this.objectList = objectList;
    this.objectFactory = objectFactory;
  }

  createStar(radius: number, texture: string, position: Vector2, mass: number, name: string): Star {
    let sprite = this.objectFactory.createSprite(texture, position, radius, radius);
    sprite.onBeforeRender = scaleToCameraDistance(50);

    let star = new Star(
      uuid(),
      new Sphere(new Vector3(position.x, position.y, 0), radius),
      mass,
      sprite,
      name,
      texture
    );
    this.objectList.addObject(star);
    star.addEventListener('remove', event => {
      this.objectList.removeObject(star);
    });
    return star;
  }

  createSolarSystem(star: Star, radius: number): SolarSystem {
    let ring = this.objectFactory.createCircle(radius, star.color);
    ring.onBeforeRender = scaleToCameraDefault();
    return new SolarSystem(radius, star, ring);
  }

  createPlanet(position: Vector2, radius: number, texture: string, mass: number) {
    let sphere = new Sphere(new Vector3(position.x, position.y, 0), radius);
    let sprite = this.objectFactory.createSprite(texture, position, radius, radius);
    sprite.scale.x = radius;
    sprite.scale.y = radius;
    sprite.onBeforeRender = scaleToCameraDistance(750);

    let planet = new Planet(uuid(), sphere, mass, sprite, texture, null);
    this.objectList.addObject(planet);
    planet.addEventListener('remove', event => {
      this.objectList.removeObject(planet);
    });
    return planet;
  }

  createBackground(n: number, bounds: Sphere, color: Color | number): Points {
    return this.objectFactory.createPoints(n, bounds, color);
  }
}
