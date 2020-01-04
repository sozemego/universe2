import { Vector2 } from 'three';
import { Universe } from '../Universe';

// let gravityCalcs = 0;
// let calcResultTimes = [];
const vector2A = new Vector2();
const vector2B = new Vector2();

onmessage = function(e) {
  if (e.data.type === 'gravityCalc') {
    // gravityCalcs = 0;
    // const clock = new Clock();
    // clock.start();

    vector2A.set(0, 0);
    vector2B.set(0, 0);

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
      const starAttractor = { x: star.position.x, y: star.position.y, z: star.mass };
      for (let i = 0; i < planets.length; i++) {
        const planet1 = planets[i];
        const planetAttractee = { x: planet1.position.x, y: planet1.position.y, z: planet1.mass };
        const [accelerationToStar] = calcAccelerationDueToGravity(starAttractor, planetAttractee);
        addResult(accelerationToStar, planet1.id, result);
        for (let j = i + 1; j < planets.length; j++) {
          const planet2 = planets[j];
          const secondPlanetAttractee = {
            x: planet2.position.x,
            y: planet2.position.y,
            z: planet2.mass,
          };
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
        const starAttractor = { x: star.position.x, y: star.position.y, z: star.mass };
        const planetAttractee = { x: planet.position.x, y: planet.position.y, z: planet.mass };
        const [acceleration] = calcAccelerationDueToGravity(starAttractor, planetAttractee);
        addResult(acceleration, planet.id, result);
      }
    }

    // clock.stop();
    // let time = clock.getElapsedTime();
    // calcResultTimes.push(time);
    // while (calcResultTimes.length > 200) {
    //   calcResultTimes.shift();
    // }
    // let average =
    //   calcResultTimes.reduce((curr, next) => {
    //     return curr + next;
    //   }, 0) / calcResultTimes.length;
    // console.log(
    //   `Gravity calcs = ${gravityCalcs} in ${(time * 1000).toFixed(2)}ms, average = ${(average * 1000).toFixed(2)}`
    // );
    // gravityCalcs = 0;
    // @ts-ignore
    this.postMessage({ type: 'gravityCalcResult', result });
  }
};

function calcAttraction(star1, star2) {
  return calcAccelerationDueToGravity(
    { x: star1.position.x, y: star1.position.y, z: star1.mass },
    { x: star2.position.x, y: star2.position.y, z: star2.mass }
  );
}

function calcAccelerationDueToGravity(attractor, attractee) {
  const distancePx = vector2A.set(attractor.x, attractor.y).distanceTo(attractee);
  const radians = vector2B
    .set(attractor.x, attractor.y)
    .sub(attractee)
    .angle();
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const distanceSquared = distancePx * distancePx;
  const accelerationA = (attractor.z / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
  const accelerationB = (attractee.z / distanceSquared) * Universe.SCALE_INSIDE_SYSTEM;
  // gravityCalcs++;
  return [
    { x: cos * accelerationA, y: sin * accelerationA },
    { x: cos * accelerationB, y: sin * accelerationB },
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
