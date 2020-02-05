import { Object3D } from 'three';
import { BaseObject } from '../BaseObject';
import { ShipType } from './types';
import { Planet } from '../Planet';

export class Ship extends BaseObject {
  readonly name: string;
  readonly type: ShipType;
  planet: Planet | null = null;

  constructor(id: string, name: string, texture: string, type: ShipType, object3D: Object3D) {
    super(id, 0, object3D, texture);
    this.name = name;
    this.type = type;
    this.object3D.visible = false;
  }

  set visible(visible: boolean) {
    this.object3D.visible = visible;
  }

  get position() {
    return this.object3D.position;
  }
}
