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
    let radius = planet.sphere.radius;
    let width = this.name.material.map?.image.width;
    let height = this.name.material.map?.image.height;
    this.background.scale.x = width;
    this.background.scale.y = height;
    this.background.position.x = planet.position.x;
    this.background.position.y = planet.position.y - Math.max(height, radius);

    // this.background.scale.x = this.name.canvas.textWidth;

    this.name.position.x = planet.position.x;
    this.name.position.y = planet.position.y - Math.max(height / 2, radius);
  }
}
