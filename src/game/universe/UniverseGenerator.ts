import { GameObjectFactory } from '../GameObjectFactory';
import { Universe } from './Universe';
import { Color, Points, Sphere, Vector2, Vector3 } from 'three';
import { angleBetween, clampAbs, random, randomPointInSphere } from '../../mathUtils';
import { SolarSystem } from '../object/SolarSystem';
import { Star } from '../object/Star';
import { planetData, PlanetData, starData, StarData } from '../data/data';
import { Planet } from '../object/Planet';

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
    let blackHoleData = starData['black1'];
    return this.createStarFromData(
      blackHoleData,
      new Vector2(this.getCenter().x, this.getCenter().y)
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
    let stars = [];

    let star = this.createStarFromData(this.getRandomStarData(), center);
    stars.push(star);

    if (isBinary) {
      let partnerRadius = star.radius * 0.5;
      let partnerMass = star.mass * 0.5;
      let starData = this.getRandomStarData();
      let partner = this.gameObjectFactory.createStar(
        partnerRadius,
        starData.texture,
        center.addScalar(distanceBetweenStars),
        partnerMass,
        starData.name
      );
      stars.push(partner);
    }

    return stars;
  }

  generatePlanetsForSolarSystem = (solarSystem: SolarSystem) => {
    let maxPlanets = 10;

    let { radius: solarSystemRadius } = solarSystem;
    let planetsToGenerate = Math.ceil(maxPlanets * (solarSystemRadius / 15000));

    let minDistanceFromCenter = 500;

    let tries = 0;
    while (solarSystem.planets.length < planetsToGenerate) {
      if (++tries > 1000) {
        throw new Error('Took too many tries to generate planets');
      }
      let position = randomPointInSphere(solarSystem.sphere, minDistanceFromCenter);

      let planet = this.createPlanetFromData(
        this.getRandomPlanetData(),
        new Vector2(position.x, position.y)
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
      planet.accelerate(solarSystem.stars[0].velocity);
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

  createPlanetFromData(data: PlanetData, position: Vector2): Planet {
    let radius = random(data.minRadius, data.maxRadius);
    let mass = random(data.minMass, data.maxMass);
    return this.gameObjectFactory.createPlanet(position, radius, data.texture, mass);
  }

  getRandomPlanetData(): PlanetData {
    let planetDataArr = Object.values(planetData);
    return planetDataArr[Math.floor(random(planetDataArr.length))];
  }

  getRandomStarData(): StarData {
    let starDataArr = Object.values(starData).filter(
      data => !data.name.toLowerCase().includes('black')
    );
    return starDataArr[Math.floor(random(starDataArr.length))];
  }

  createStarFromData(data: StarData, position: Vector2): Star {
    let radius = random(data.minRadius, data.maxRadius);
    let mass = random(data.minMass, data.maxMass);
    return this.gameObjectFactory.createStar(radius, data.texture, position, mass, data.name);
  }

  getCenter() {
    return this.bounds.center;
  }
}
