import { PlanetStorage } from './PlanetStorage';
import { Resource } from './Resource';

describe('Planet storage', () => {
  it('Should add a resource to empty storage', () => {
    let planetStorage = new PlanetStorage(5);
    planetStorage.addResource(Resource.FOOD, 5);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(5);
    expect(planetStorage.capacityTaken).toBe(5);
    expect(planetStorage.freeCapacity).toBe(0);
  });
  it('Should add two types of resources to empty storage', () => {
    let planetStorage = new PlanetStorage(5);
    planetStorage.addResource(Resource.FOOD, 2);
    planetStorage.addResource(Resource.BUILDING_MATERIAL, 2);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(2);
    expect(planetStorage.getTakenByResource(Resource.BUILDING_MATERIAL)).toBe(2);
    expect(planetStorage.capacityTaken).toBe(4);
    expect(planetStorage.freeCapacity).toBe(1);
  });
  it("Should not any more resources when it's full", () => {
    let planetStorage = new PlanetStorage(5);
    planetStorage.addResource(Resource.FOOD, 4);
    planetStorage.addResource(Resource.FOOD, 5);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(4);
    expect(planetStorage.capacityTaken).toBe(4);
    expect(planetStorage.freeCapacity).toBe(1);
  });
  it('Should remove resources if present', () => {
    let planetStorage = new PlanetStorage(10);
    planetStorage.addResource(Resource.FOOD, 3);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(3);
    expect(planetStorage.capacityTaken).toBe(3);
    expect(planetStorage.freeCapacity).toBe(7);

    planetStorage.removeResource(Resource.FOOD, 2);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(1);
    expect(planetStorage.capacityTaken).toBe(1);
    expect(planetStorage.freeCapacity).toBe(9);
  });
  it('should remove multiple resources if present', () => {
    let planetStorage = new PlanetStorage(10);
    planetStorage.addResource(Resource.FOOD, 3);
    planetStorage.addResource(Resource.BUILDING_MATERIAL, 3);
    planetStorage.addResource(Resource.METAL, 3);
    expect(planetStorage.capacityTaken).toBe(9);
    expect(planetStorage.freeCapacity).toBe(1);
    planetStorage.removeResource(Resource.FOOD, 1);
    planetStorage.removeResource(Resource.BUILDING_MATERIAL, 1);
    planetStorage.removeResource(Resource.METAL, 1);
    expect(planetStorage.capacityTaken).toBe(6);
    expect(planetStorage.freeCapacity).toBe(4);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(2);
  });
  it('removing too much resource will not remove it', () => {
    let planetStorage = new PlanetStorage(10);
    planetStorage.addResource(Resource.FOOD, 5);
    expect(planetStorage.capacityTaken).toBe(5);
    expect(planetStorage.freeCapacity).toBe(5);
    planetStorage.removeResource(Resource.FOOD, 10);
    expect(planetStorage.capacityTaken).toBe(5);
    expect(planetStorage.freeCapacity).toBe(5);
  });
  it('removing resource that does not exist, will not modify the storage', () => {
    let planetStorage = new PlanetStorage(5);
    planetStorage.addResource(Resource.FOOD, 5);
    expect(planetStorage.capacityTaken).toBe(5);
    expect(planetStorage.freeCapacity).toBe(0);
    planetStorage.removeResource(Resource.BUILDING_MATERIAL, 5);
    expect(planetStorage.capacityTaken).toBe(5);
    expect(planetStorage.freeCapacity).toBe(0);
  });
  it('clear should remove all resources', () => {
    let planetStorage = new PlanetStorage(10);
    planetStorage.addResource(Resource.FOOD, 5);
    planetStorage.addResource(Resource.METAL, 5);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(5);
    expect(planetStorage.getTakenByResource(Resource.METAL)).toBe(5);
    expect(planetStorage.capacityTaken).toBe(10);
    expect(planetStorage.freeCapacity).toBe(0);
    planetStorage.clear();
    expect(planetStorage.capacityTaken).toBe(0);
    expect(planetStorage.freeCapacity).toBe(10);
    expect(planetStorage.getTakenByResource(Resource.FOOD)).toBe(0);
    expect(planetStorage.getTakenByResource(Resource.METAL)).toBe(0);
  });
  it('Fill should fill an empty storage up to a number', () => {
    let planetStorage = new PlanetStorage(500);
    let amountAdded = planetStorage.fill(Resource.FOOD, 400);
    expect(planetStorage.capacityTaken).toBe(400);
    expect(planetStorage.freeCapacity).toBe(100);
    expect(amountAdded).toBe(400);
    amountAdded = planetStorage.fill(Resource.FOOD, 400);
    expect(planetStorage.capacityTaken).toBe(500);
    expect(planetStorage.freeCapacity).toBe(0);
    expect(amountAdded).toBe(100);
  });
});
