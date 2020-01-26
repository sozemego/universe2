import { Object3D } from 'three';
import { Text2D } from 'three-text2d/lib/Text2D';
import { Planet } from '../../object/Planet';

export class PlanetNamePlate {
  private readonly background: Object3D;
  private readonly name: Text2D;

  constructor(background: Object3D, name: Text2D) {
    this.background = background;
    this.name = name;
  }

  update(planet: Planet) {
    let planetScale = planet.object3D.scale;
    let planetSize = planetScale.x;
    let width = this.name.width;
    let height = this.name.height;
    this.background.position.x = planet.position.x;
    this.background.position.y = planet.position.y - Math.max(height, planetSize);
    this.background.scale.x = width * 1.1;
    this.background.scale.y = height;

    this.name.position.x = planet.position.x;
    this.name.position.y = planet.position.y - Math.max(height, planetSize);
  }
}
