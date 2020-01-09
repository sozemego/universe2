import { GameObjectFactory } from '../GameObjectFactory';
import { Universe } from './Universe';
import { Color, Points, Sphere, Vector2, Vector3 } from 'three';
import { angleBetween, clampAbs, random, randomPointInSphere } from '../../mathUtils';
import { SolarSystem } from '../object/SolarSystem';
import { Star } from '../object/Star';

export class UniverseGenerator {
  private readonly gameObjectFactory: GameObjectFactory;
  private bounds: Sphere;

  constructor(gameObjectFactory: GameObjectFactory) {
    this.gameObjectFactory = gameObjectFactory;
    this.bounds = new Sphere(
      new Vector3(Universe.UNIVERSE_RADIUS / 2, Universe.UNIVERSE_RADIUS / 2, 0),
      Universe.UNIVERSE_RADIUS
    );
  }

  generateUniverse(): Universe {
    let centerBlackHole = this.generateCenterBlackHole();
    let solarSystems = this.generateSolarSystems();
    solarSystems.forEach(this.generatePlanetsForSolarSystem);
    let background = this.generateBackground();
    console.log('Generated universe');
    return new Universe(centerBlackHole, solarSystems, [], background, this.bounds.clone());
  }

  generateCenterBlackHole() {
    return this.gameObjectFactory.createStar(
      1024,
      'textures/black_hole_1.png',
      new Vector2(this.getCenter().x, this.getCenter().y),
      5000,
      'Black hole'
    );
  }

  generateSolarSystems(): SolarSystem[] {
    let systems = 20;
    console.log('Generating', systems, 'systems');
    let minRadius = 2500;
    let maxRadius = 15000;
    let minDistanceFromCenter = 15000;

    let solarSystems: SolarSystem[] = [];
    let tries = 0;
    let isBinary = Math.random() <= 0.2;
    while (solarSystems.length < systems) {
      if (++tries > 1000) {
        throw new Error('Too many tries to generate solar systems');
      }
      let angle = (random(360) * Math.PI) / 180;
      let distance = random(minDistanceFromCenter, this.bounds.radius);
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      let x = cos * distance + this.getCenter().x;
      let y = sin * distance + this.getCenter().y;
      if (distance < minDistanceFromCenter) {
        continue;
      }
      let radius = random(minRadius, maxRadius);
      if (isBinary) {
        radius *= 1.5;
      }
      let sphere = new Sphere(new Vector3(x, y, 0), radius);
      if (this.doesCollide(sphere, solarSystems)) {
        continue;
      }

      let stars = this.generateStars(true, new Vector2(x, y));

      let solarSystem = this.gameObjectFactory.createSolarSystem(stars, radius);
      solarSystems.push(solarSystem);

      let cosAcc = Math.cos(angle + (90 * Math.PI) / 180);
      let sinAcc = Math.sin(angle + (90 * Math.PI) / 180);
      let percentageOfDistance = clampAbs(1 - distance / this.bounds.radius, 0.5, 1);
      stars.forEach(star =>
        star.accelerate(
          new Vector2(cosAcc * 100 * percentageOfDistance, sinAcc * 100 * percentageOfDistance)
        )
      );
    }
    return solarSystems;
  }

  generateStars(isBinary: boolean, center: Vector2): Star[] {
    let distanceBetweenStars = 768;
    let minStarRadius = 128;
    let maxStarRadius = minStarRadius * 3;
    let stars = [];

    let starRadius = random(minStarRadius, maxStarRadius);
    let mass = random(40, 60);
    let star = this.gameObjectFactory.createStar(
      starRadius,
      'textures/white_star_1.png',
      center,
      mass,
      'White star'
    );
    stars.push(star);

    if (isBinary) {
      let partnerRadius = starRadius * 0.5;
      let partnerMass = mass * 0.5;
      let partner = this.gameObjectFactory.createStar(
        partnerRadius,
        'textures/white_star_1.png',
        center.addScalar(distanceBetweenStars),
        partnerMass,
        'White star'
      );
      stars.push(partner);
    }

    return stars;
  }

  generatePlanetsForSolarSystem = (solarSystem: SolarSystem) => {
    let maxPlanets = 10;

    let { radius: solarSystemRadius } = solarSystem;
    let planetsToGenerate = Math.ceil(maxPlanets * (solarSystemRadius / 15000));

    let minRadius = 12.5;
    let maxRadius = minRadius * 3;
    let minDistanceFromCenter = 500;
    let minMass = 0.005;
    let maxMass = 0.05;

    let tries = 0;
    while (solarSystem.planets.length < planetsToGenerate) {
      if (++tries > 1000) {
        throw new Error('Took too many tries to generate planets');
      }
      let position = randomPointInSphere(solarSystem.sphere, minDistanceFromCenter);
      let radius = random(minRadius, maxRadius);
      let mass = random(minMass, maxMass);

      let planet = this.gameObjectFactory.createPlanet(
        new Vector2(position.x, position.y),
        radius,
        'textures/green_planet_1.png',
        mass
      );
      let angleRad = angleBetween(
        new Vector2(position.x, position.y),
        new Vector2(solarSystem.sphere.center.x, solarSystem.sphere.center.y)
      );
      let percentageOfDistance =
        1 - position.distanceTo(solarSystem.sphere.center) / solarSystemRadius;
      planet.accelerate(
        new Vector2(
          Math.cos(angleRad + (90 * Math.PI) / 180) * 50 * percentageOfDistance,
          Math.sin(angleRad + (90 * Math.PI) / 180) * 50 * percentageOfDistance
        )
      );
      planet.accelerate(solarSystem.stars[0].acceleration);
      solarSystem.addPlanet(planet);
    }
  };

  generateBackground(): Points {
    return this.gameObjectFactory.createBackground(
      10000,
      this.bounds.clone().set(this.bounds.center, this.bounds.radius * 5),
      Color.NAMES['white']
    );
  }

  doesCollide(sphere: Sphere, solarSystems: SolarSystem[]) {
    for (let solarSystem of solarSystems) {
      if (solarSystem.sphere.intersectsSphere(sphere)) {
        return true;
      }
    }
    return false;
  }

  getCenter() {
    return this.bounds.center;
  }
}
