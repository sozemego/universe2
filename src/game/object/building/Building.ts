import { Planet } from '../Planet';

export class Building {
  readonly id: string;
  readonly planet: Planet;
  readonly texture: string;
  readonly name: string;

  constructor(id: string, planet: Planet, texture: string, name: string) {
    this.id = id;
    this.planet = planet;
    this.texture = texture;
    this.name = name;
  }

  update(delta: number) {}
}
