import uuid from 'uuid/v4';
import { Color, Object3D, Points, Sphere, Sprite, Vector2, Vector3 } from 'three';
import { ObjectList } from './ObjectList';
import { ObjectFactory } from './ObjectFactory';
import { scaleToCameraDistance } from './util/utils';
import { Star } from './object/Star';
import { SolarSystem } from './object/SolarSystem';
import { Planet } from './object/Planet';
import { SelectionContainer } from './SelectionContainer';
import { textures } from './data/textures';

export class GameObjectFactory {
  private readonly objectList: ObjectList;
  private readonly objectFactory: ObjectFactory;
  private readonly selectionContainer: SelectionContainer;

  constructor(
    objectList: ObjectList,
    objectFactory: ObjectFactory,
    selectionContainer: SelectionContainer
  ) {
    this.objectList = objectList;
    this.objectFactory = objectFactory;
    this.selectionContainer = selectionContainer;
  }

  createStar(radius: number, texture: string, position: Vector2, mass: number, name: string): Star {
    let sprite = this.objectFactory.createSprite(texture, position, radius * 2, radius * 2);
    sprite.onBeforeRender = scaleToCameraDistance(2);

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
      if (this.selectionContainer.selected === star.id) {
        this.selectionContainer.selected = null;
      }
    });
    return star;
  }

  createSolarSystem(stars: Star[], radius: number): SolarSystem {
    let ring = this.objectFactory.createCircle(radius, stars[0].color);
    ring.onBeforeRender = scaleToCameraDistance(1);
    return new SolarSystem(uuid(), radius, stars, ring);
  }

  createPlanet(position: Vector2, radius: number, texture: string, mass: number) {
    let sphere = new Sphere(new Vector3(position.x, position.y, 0), radius);
    let sprite = this.objectFactory.createSprite(texture, position, radius * 2, radius * 2);
    sprite.scale.x = radius;
    sprite.scale.y = radius;
    sprite.onBeforeRender = scaleToCameraDistance(25);

    let planet = new Planet(uuid(), sphere, mass, sprite, texture, null);
    this.objectList.addObject(planet);
    planet.addEventListener('remove', event => {
      this.objectList.removeObject(planet);
      if (this.selectionContainer.selected === planet.id) {
        this.selectionContainer.selected = null;
      }
    });
    return planet;
  }

  createBackground(n: number, bounds: Sphere, color: Color | number): Points {
    return this.objectFactory.createPoints(n, bounds, color);
  }

  createBackgroundSprite(bounds: Sphere) {
    this.objectFactory.createBackground(
      textures.hub005,
      new Vector2().set(bounds.center.x, bounds.center.y),
      100000,
      100000
    );
  }
}
