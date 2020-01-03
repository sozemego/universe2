import { Line, Material } from 'three';

export class Rectangle extends Line {
  dispose() {
    if (this.material instanceof Material) {
      this.material.dispose();
    }
    this.geometry.dispose();
    this.parent?.remove(this);
  }
}
