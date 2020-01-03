import { resetAllPools, Vector2Pool } from './Pools';
import { Vector2 } from 'three';

beforeEach(() => {
  resetAllPools();
});

/**
 * Vector2Pool is a real pool, but used here as a test pool.
 * Other pools will not be tested as thoroughly.
 */
describe('Vector2 pool', () => {
  it('Should return a new Vector2', () => {
    let vector2 = Vector2Pool.obtain();
    expect(vector2).toBeInstanceOf(Vector2);
  });
  it('Should reset the vector after freeing it', () => {
    let vector2 = Vector2Pool.obtain();
    vector2.x = 5;
    vector2.y = 15;
    Vector2Pool.free(vector2);
    expect(vector2.x).toBe(0);
    expect(vector2.y).toBe(0);
  });
  it('Should return the same instance after obtaining it once, freeing and then obtaining again', () => {
    let vector2 = Vector2Pool.obtain();
    vector2.x = 25;
    vector2.y = 15;
    Vector2Pool.free(vector2);
    expect(vector2.x).toBe(0);
    expect(vector2.y).toBe(0);
    let vector2a = Vector2Pool.obtain();
    expect(vector2).toEqual(vector2a);
    expect(vector2a.x).toBe(0);
    expect(vector2a.y).toBe(0);
  });
  it('Should return multiple different instances, when calling obtain many times', () => {
    let instances: Vector2[] = [];
    for (let i = 0; i < 50; i++) {
      instances.push(Vector2Pool.obtain());
    }
    expect(instances.filter(Boolean).length).toEqual(50);
    for (let i = 0; i < instances.length; i++) {
      for (let j = i + 1; j < instances.length; j++) {
        expect(instances[i]).not.toBe(instances[j]);
      }
    }
  });
});
