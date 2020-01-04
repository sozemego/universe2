import { Vector2, Vector3 } from 'three';
import { Universe } from '../Universe';

onmessage = function(e) {
  if (e.data.type === 'gravityCalc') {
    const data = e.data.data;

    const stars = data.stars;
    const result = {};
    for (const star1 of stars) {
      for (const star2 of stars) {
        if (star1 === star2) continue;
        const acceleration = calcAttraction(star1, star2);
        result[star2.id] = accelerationToResult(acceleration);
      }
    }
    const { centerStar } = data;
    if (centerStar) {
      for (const star of stars) {
        const acceleration = calcAttraction(centerStar, star);
        result[star.id] = accelerationToResult(acceleration);
      }
    }

    const { planets: planetData } = data;
    for (const star of stars) {
      const planets = planetData[star.id];
      const starAttractor = new Vector3(star.position.x, star.position.y, star.mass);
      for (const planet1 of planets) {
        const planetAttractee = new Vector3(planet1.position.x, planet1.position.y, planet1.mass);
        const accelerationToStar = calcAccelerationDueToGravity(starAttractor, planetAttractee);
        for (const planet2 of planets) {
          if (planet1 === planet2) continue;
          const secondPlanetAttractee = new Vector3(
            planet2.position.x,
            planet2.position.y,
            planet2.mass
          );
          const accelerationToPlanet = calcAccelerationDueToGravity(
            planetAttractee,
            secondPlanetAttractee
          );
          result[planet1.id] = accelerationToResult(accelerationToStar.add(accelerationToPlanet));
        }
      }
    }
    const { freePlanets } = data;
    for (let planet of freePlanets) {
      for (let star of stars) {
        let starAttractor = new Vector3(star.position.x, star.position.y, star.mass);
        let planetAttractee = new Vector3(planet.position.x, planet.position.y, planet.mass);
        result[planet.id] = calcAccelerationDueToGravity(starAttractor, planetAttractee);
      }
    }

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
  const acceleration = (attractor.z / (distancePx * distancePx)) * Universe.SCALE_INSIDE_SYSTEM;
  return new Vector2(cos * acceleration, sin * acceleration);
}

function accelerationToResult(acceleration) {
  return { x: acceleration.x, y: acceleration.y };
}

function addResult(acceleration, id, result) {
  let previousResult = result[id];
  if(previousResult) {
    previousResult.x += acceleration.x;
    previousResult.y += acceleration.y;
  } else {
    result[id] = acceleration;
  }
}