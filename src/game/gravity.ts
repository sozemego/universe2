import { BaseObject } from './object/BaseObject';
import { Universe } from './universe/Universe';
import { Vector2 } from 'three';

const VECTOR2A = new Vector2();
const VECTOR2B = new Vector2();

export function calcAccelerationDueToGravity(attractor: BaseObject, attractee: BaseObject) {
  let distancePx = VECTOR2A.set(attractor.position.x, attractor.position.y).distanceTo(
    VECTOR2B.set(attractee.position.x, attractee.position.y)
  );
  let radians = VECTOR2B.set(attractor.position.x, attractor.position.y)
    .sub(VECTOR2A.set(attractee.position.x, attractee.position.y))
    .angle();
  let cos = Math.cos(radians);
  let sin = Math.sin(radians);
  let distanceSquared = distancePx * distancePx;
  let accelerationA = (attractor.mass / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
  let accelerationB = (attractee.mass / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
  return [
    VECTOR2A.set(cos * accelerationA, sin * accelerationA),
    VECTOR2B.set(cos * accelerationB, sin * accelerationB),
  ];
}
