import { Color, Points, Sphere, Sprite, Vector2, Vector3 } from 'three';
import { GameObjectFactory } from '../GameObjectFactory';
import { Universe } from './Universe';
import { angleBetween, random } from '../../mathUtils';
import { SolarSystem } from '../object/SolarSystem';
import { Star } from '../object/Star';
import { planetData, PlanetData, starData, StarData } from '../data/data';
import { Planet } from '../object/Planet';
import { calcDistance } from '../util/utils';

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
    this.generateBackground();
    let centerBlackHole = this.generateCenterBlackHole();
    let solarSystems = this.generateSolarSystems(centerBlackHole);
    solarSystems.forEach(this.generatePlanetsForSolarSystem);
    console.log('Generated universe');
    return new Universe(centerBlackHole, solarSystems, [], this.bounds.clone());
  }

  generateCenterBlackHole() {
    let blackHoleData = starData['black1'];
    return this.createStarFromData(
      blackHoleData,
      new Vector2(this.getCenter().x, this.getCenter().y)
    );
  }

  generateSolarSystems(blackHole: Star): SolarSystem[] {
    let systems = 20;
    console.log('Generating', systems, 'systems');
    let minRadius = 2500;
    let maxRadius = 15000;
    let minDistanceFromCenter = 15000;

    let solarSystems: SolarSystem[] = [];
    let tries = 0;
    let isBinary = false;
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

      let stars = this.generateStars(isBinary, new Vector2(x, y));

      let solarSystem = this.gameObjectFactory.createSolarSystem(stars, radius);
      solarSystem.orbitalDistance = calcDistance(solarSystem, blackHole);
      let distancePercentage = 1 - distance / this.bounds.radius;
      solarSystem.angularVelocity = 0.2 * distancePercentage;
      solarSystem.angle = angleBetween(solarSystem.position, blackHole.position) * (180 / Math.PI);
      solarSystems.push(solarSystem);
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

    let minDistanceFromCenter = 1000;
    let distanceFromEdge = 100;
    let possibleDistance = solarSystemRadius - minDistanceFromCenter - distanceFromEdge;

    for (let i = 0; i < planetsToGenerate; i++) {
      let distance = i === 0 ? minDistanceFromCenter : (i / planetsToGenerate) * possibleDistance;
      let angle = random(360);

      let position = new Vector2();
      position.x = solarSystem.position.x + distance * Math.cos(angle * (Math.PI / 180));
      position.y = solarSystem.position.y + distance * Math.sin(angle * (Math.PI / 180));

      let planet = this.createPlanetFromData(
        this.getRandomPlanetData(),
        new Vector2(position.x, position.y)
      );
      planet.orbitalDistance = calcDistance(planet, solarSystem);
      let distancePercentage = 1 - planet.orbitalDistance / solarSystem.radius;
      planet.angularVelocity = distancePercentage;
      planet.angle = angle;
      solarSystem.addPlanet(planet);
    }
  };

  generateBackground() {
    this.gameObjectFactory.createBackgroundSprite(
      this.bounds.clone().set(this.bounds.center, this.bounds.radius * 5)
    );
  }

  generateBackgroundSprite() {
    this.gameObjectFactory.createBackgroundSprite(
      this.bounds.clone().set(this.bounds.center, this.bounds.radius * 5)
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
