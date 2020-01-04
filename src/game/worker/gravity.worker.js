import { Vector2, Vector3 } from 'three';
import { Universe } from '../Universe';

let gravityCalcs = 0;

onmessage = function(e) {
  if (e.data.type === 'gravityCalc') {
    gravityCalcs = 0;
    const data = e.data.data;

    const stars = data.stars;
    const result = {};

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const star1 = stars[i];
        const star2 = stars[j];
        const [accelerationA, accelerationB] = calcAttraction(star1, star2);
        addResult(accelerationA, star2.id, result);
        addResult(accelerationB, star1.id, result);
      }
    }

    const { centerStar } = data;
    if (centerStar) {
      for (const star of stars) {
        const [accelerationA] = calcAttraction(centerStar, star);
        addResult(accelerationA, star.id, result);
      }
    }

    const { planets: planetData } = data;
    for (const star of stars) {
      const planets = planetData[star.id];
      const starAttractor = new Vector3(star.position.x, star.position.y, star.mass);
      for (let i = 0; i < planets.length; i++) {
        const planet1 = planets[i];
        const planetAttractee = new Vector3(planet1.position.x, planet1.position.y, planet1.mass);
        const [accelerationToStar] = calcAccelerationDueToGravity(starAttractor, planetAttractee);
        addResult(accelerationToStar, planet1.id, result);
        for (let j = i + 1; j < planets.length; j++) {
          const planet2 = planets[j];
          const secondPlanetAttractee = new Vector3(
            planet2.position.x,
            planet2.position.y,
            planet2.mass
          );
          const [accelerationToPlanetA, accelerationToPlanetB] = calcAccelerationDueToGravity(
            planetAttractee,
            secondPlanetAttractee
          );
          addResult(accelerationToPlanetA, planet1.id, result);
          addResult(accelerationToPlanetB, planet2.id, result);
        }
      }
    }
    const { freePlanets } = data;
    for (let planet of freePlanets) {
      for (let star of stars) {
        let starAttractor = new Vector3(star.position.x, star.position.y, star.mass);
        let planetAttractee = new Vector3(planet.position.x, planet.position.y, planet.mass);
        const [acceleration] = calcAccelerationDueToGravity(starAttractor, planetAttractee);
        addResult(acceleration, planet.id, result);
      }
    }

    console.log(`Gravity calcs = ${gravityCalcs}`);
    gravityCalcs = 0;
    // @ts-ignore
    this.postMessage({ type: 'gravityCalcResult', result });
  }
};

function calcAttraction(star1, star2) {
  return calcAccelerationDueToGravity(
    new Vector3(star1.position.x, star1.position.y, star1.mass),
    new Vector3(star2.position.x, star2.position.y, star2.mass)
  );
}

function calcAccelerationDueToGravity(attractor, attractee) {
  const distancePx = new Vector2(attractor.x, attractor.y).distanceTo(attractee);
  const radians = new Vector2(attractor.x, attractor.y).sub(attractee).angle();
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const distanceSquared = distancePx * distancePx;
  const accelerationA = (attractor.z / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
  const accelerationB = (attractee.z / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
  gravityCalcs++;
  return [
    new Vector2(cos * accelerationA, sin * accelerationA),
    new Vector2(cos * accelerationB, sin * accelerationB),
  ];
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
