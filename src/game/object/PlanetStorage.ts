import { Resource } from './Resource';

export class PlanetStorage {
  private capacity: number;
  resources: Record<Resource, number> = {
    [Resource.BUILDING_MATERIAL]: 0,
    [Resource.FOOD]: 0,
    [Resource.METAL]: 0,
  };

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  addResource(resource: Resource, amount: number) {
    if (!this.canFit(resource, amount)) {
      return;
    }
    let count = this.resources[resource];
    this.resources[resource] = count + amount;
  }

  removeResource(resource: Resource, amount: number) {
    if (this.getTakenByResource(resource) < amount) {
      return;
    }
    let count = this.resources[resource];
    this.resources[resource] = count - amount;
  }

  canFit(resource: Resource, amount: number): boolean {
    return this.freeCapacity >= amount;
  }

  fill(resource: Resource, amount: number): number {
    let toAdd = Math.min(this.freeCapacity, amount);
    this.addResource(resource, toAdd);
    return toAdd;
  }

  get capacityTaken(): number {
    return Object.values(this.resources).reduce((total, count) => total + count, 0);
  }

  get freeCapacity(): number {
    return this.capacity - this.capacityTaken;
  }

  getTakenByResource(resource: Resource): number {
    return this.resources[resource] || 0;
  }

  clear() {
    Object.keys(this.resources).forEach(resource => (this.resources[resource as Resource] = 0));
  }
}
