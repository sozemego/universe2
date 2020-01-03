import { Vector2, Vector3 } from 'three';
import { Universe } from '../Universe';
import { Vector2Pool, Vector3Pool } from '../util/Pools';
import { angleBetween } from "../../mathUtils";

onmessage = function(e) {
  if (e.data.type === 'gravityCalc') {
    const data = e.data.data;

    const stars = data.stars;
    const result = {};
    let resultVectorA = Vector2Pool.obtain();
    let resultVectorB = Vector2Pool.obtain();
    for (const star1 of stars) {
      for (const star2 of stars) {
        if (star1 === star2) continue;
        const acceleration = calcAttraction(star1, star2, resultVectorA);
        addResult(accelerationToResult(acceleration), star2.id, result);
      }
    }
    const { centerStar } = data;
    if (centerStar) {
      for (const star of stars) {
        const acceleration = calcAttraction(centerStar, star, resultVectorA);
        addResult(accelerationToResult(acceleration), star.id, result);
      }
    }

    let vectorA = Vector3Pool.obtain();
    let vectorB = Vector3Pool.obtain();
    let vectorC = Vector3Pool.obtain();

    const { planets: planetData } = data;
    for (const star of stars) {
      const planets = planetData[star.id];
      const starAttractor = vectorA.set(star.position.x, star.position.y, star.mass);
      for (const planet1 of planets) {
        const planetAttractee = vectorB.set(planet1.position.x, planet1.position.y, planet1.mass);
        const accelerationToStar = calcAccelerationDueToGravity(starAttractor, planetAttractee, resultVectorA);
        for (const planet2 of planets) {
          if (planet1 === planet2) continue;
          const secondPlanetAttractee = vectorC.set(
            planet2.position.x,
            planet2.position.y,
            planet2.mass
          );
          const accelerationToPlanet = calcAccelerationDueToGravity(
            planetAttractee,
            secondPlanetAttractee,
            resultVectorB
          );
          result[planet1.id] = accelerationToResult(accelerationToStar.add(accelerationToPlanet));
        }
      }
    }

    const { freePlanets } = data;
    for (let planet of freePlanets) {
      for (let star of stars) {
        let starAttractor = vectorA.set(star.position.x, star.position.y, star.mass);
        let planetAttractee = vectorB.set(planet.position.x, planet.position.y, planet.mass);
        result[planet.id] = calcAccelerationDueToGravity(starAttractor, planetAttractee, resultVectorA);
      }
    }

    Vector3Pool.free(vectorA);
    Vector3Pool.free(vectorB);
    Vector3Pool.free(vectorC);
    Vector2Pool.free(resultVectorA);
    Vector2Pool.free(resultVectorB);

    // @ts-ignore
    this.postMessage({ type: 'gravityCalcResult', result });
  }
};

function calcAttraction(star1, star2, result) {
  let vectorA = Vector3Pool.obtain();
  let vectorB = Vector3Pool.obtain();
  let acceleration = calcAccelerationDueToGravity(
    vectorA.set(star1.position.x, star1.position.y, star1.mass),
    vectorB.set(star2.position.x, star2.position.y, star2.mass),
    result
  );
  Vector3Pool.free(vectorA);
  Vector3Pool.free(vectorB);
  return acceleration;
}

function calcAccelerationDueToGravity(attractor, attractee, result) {
  const distancePx = attractor.distanceTo(attractee);
  const radians = angleBetween(attractor, attractee);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const acceleration = (attractor.z / (distancePx * distancePx)) * Universe.SCALE_INSIDE_SYSTEM;
  if (result) {
    return result.set(cos * acceleration, sin * acceleration);
  }
  return new Vector2(cos * acceleration, sin * acceleration);
}

function accelerationToResult(acceleration) {
  return { x: acceleration.x, y: acceleration.y };
}

function addResult(acceleration, id, result) {
  let previousResult = result[id];
  if (previousResult) {
    previousResult.x += acceleration.x;
    previousResult.y += acceleration.y;
  } else {
    result[id] = acceleration;
  }
}
