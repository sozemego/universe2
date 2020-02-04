import { Object3D } from 'three';

export class Ship {
  readonly id: string;
  readonly name: string;
  readonly texture: string;
  readonly object3D: Object3D;

  constructor(id: string, name: string, texture: string, object3D: Object3D) {
    this.id = id;
    this.name = name;
    this.texture = texture;
    this.object3D = object3D;
    this.object3D.visible = false;
  }

  set visible(visible: boolean) {
    this.object3D.visible = visible;
  }
}
