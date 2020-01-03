import { BaseObject } from './object/BaseObject';

export class ObjectList {
  private objects: any[];

  constructor() {
    this.objects = [];
  }

  addObject(obj: any) {
    this.objects.push(obj);
  }

  removeObject(obj: any) {
    const index = this.objects.findIndex(o => o === obj);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  findById(id: string | null): BaseObject | null {
    if (!id) {
      return null;
    }
    return this.objects.find(obj => obj.id === id);
  }

  get allObjects() {
    return this.objects;
  }
}
