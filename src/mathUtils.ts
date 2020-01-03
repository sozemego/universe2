import { Sphere, Vector2, Vector3 } from 'three';
import { Vector2Pool } from './game/util/Pools';

export function random(num1: number): number;
export function random(num1: number, num2: number): number;

export function random(num1: number, num2?: number) {
  const num1Defined = num1 !== null && num1 !== undefined;
  const num2Defined = num2 !== null && num2 !== undefined;
  if (num1Defined && num2Defined) {
    return num1 + Math.random() * ((num2 as number) - num1);
  }
  if (num1Defined && !num2Defined) {
    return Math.random() * num1;
  }
  throw new Error('Either num1 or both num1 and num2 have to be defined');
}

export function randomAngleRad(): number {
  return (random(360) * Math.PI) / 180;
}

export function randomPointInSphere(sphere: Sphere): Vector3;
export function randomPointInSphere(sphere: Sphere, minDistance: number): Vector3;
export function randomPointInSphere(sphere: Sphere, minDistance: number, vector: Vector3): Vector3;

export function randomPointInSphere(
  sphere: Sphere,
  minDistance?: number,
  vector?: Vector3
): Vector3 {
  const angle = randomAngleRad();
  const distance = random(minDistance ? minDistance : 0, sphere.radius);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = cos * distance + sphere.center.x;
  const y = sin * distance + sphere.center.y;
  if (vector) {
    return vector.set(x, y, 0);
  }
  return new Vector3(x, y, 0);
}

export function angleBetween(vector1: Vector2, vector2: Vector2): number {
  let tempVector = Vector2Pool.obtain();
  tempVector.set(vector1.x, vector1.y);
  let angle = tempVector.sub(vector2).angle();
  Vector2Pool.free(tempVector);
  return angle;
}

/**
 * Clamps the value between min and max, but preserves the sign.
 * @param value
 * @param min
 * @param max
 */
export function clampAbs(value: number, min: number, max: number) {
  const sign = Math.sign(value);
  const abs = Math.abs(value);
  if (abs < min) {
    return sign * min;
  }
  if (abs > max) {
    return sign * max;
  }
  return value;
}
