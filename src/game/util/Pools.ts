import { Vector2, Vector3 } from 'three';
import { Pool } from './Pool';

export enum PoolType {
  VECTOR_2 = 'VECTOR_2',
  VECTOR_3 = 'VECTOR_3',
}

export interface IPools {
  [PoolType.VECTOR_2]: Pool<Vector2>;
  [PoolType.VECTOR_3]: Pool<Vector3>;
}

export const POOL: IPools = {
  [PoolType.VECTOR_2]: new Pool<Vector2>(() => new Vector2(), resetVector2),
  [PoolType.VECTOR_3]: new Pool<Vector3>(() => new Vector3(), resetVector3),
};

// export const {
//   [PoolType.VECTOR_2]: Vector2Pool,
//   [PoolType.VECTOR_3]: Vector3Pool,
// } = POOL;

export function resetAllPools() {
  Object.values(POOL).forEach(pool => pool.reset());
}

function resetVector2(vector: Vector2) {
  vector.x = 0;
  vector.y = 0;
  vector.width = 0;
  vector.height = 0;
}

function resetVector3(vector: Vector3) {
  vector.x = 0;
  vector.y = 0;
  vector.z = 0;
}
