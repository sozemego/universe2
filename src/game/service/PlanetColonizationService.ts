import { IGameService } from './index';
import { PlanetService } from './PlanetService';
import { Planet } from '../object/Planet';
import { ObjectList } from '../ObjectList';
import { Ship } from '../object/ship/Ship';
import { ShipType } from '../object/ship/types';
import { Vector2 } from 'three';

export class PlanetColonizationService implements IGameService {
  private readonly objectList: ObjectList;
  private readonly planetService: PlanetService;
  private readonly colonizationEfforts: Record<string, PlanetColonizationEffort> = {};

  constructor(objectList: ObjectList, planetService: PlanetService) {
    this.objectList = objectList;
    this.planetService = planetService;
  }

  update(delta: number) {
    let shipSpeed = 250 * delta;
    let colonizedPlanets: string[] = [];
    Object.values(this.colonizationEfforts).forEach(effort => {
      let { ship, planet } = effort;
      let distance = planet.position.distanceTo(ship.position);
      let radians = new Vector2(planet.position.x, planet.position.y)
        .sub(new Vector2(ship.position.x, ship.position.y))
        .angle();
      let cos = Math.cos(radians);
      let sin = Math.sin(radians);
      ship.position.x += cos * shipSpeed;
      ship.position.y += sin * shipSpeed;
      if (distance < planet.radius) {
        colonizedPlanets.push(planet.id);
      }
    });
    colonizedPlanets.forEach(planetId => {
      let effort = this.colonizationEfforts[planetId];
      delete this.colonizationEfforts[planetId];
      this.planetService.colonizePlanet(effort.planet);
      this.objectList.removeObject(effort.ship);
      effort.ship.dispose();
    });
  }

  colonizePlanet(planet: Planet) {
    if (!this.canColonize(planet)) {
      return;
    }
    let effort = this.colonizationEfforts[planet.id];
    if (effort) {
      return;
    }
    let colonyShip = this.getAvailableColonyShip();
    if (!colonyShip) {
      return;
    }
    effort = {
      planet,
      ship: colonyShip,
    };
    this.colonizationEfforts[planet.id] = effort;
    this.planetService.launchShip(colonyShip.planet as Planet, colonyShip);
  }

  canColonize(planet: Planet) {
    return this.getAvailableColonyShip() !== null;
  }

  getAvailableColonyShip(): Ship | null {
    let colonyShips = this.objectList
      .getByType<Ship>(Ship)
      .filter(ship => ship.type === ShipType.COLONY_SHIP)
      .filter(ship => ship.planet);
    return colonyShips.length > 0 ? colonyShips[0] : null;
  }
}

interface PlanetColonizationEffort {
  planet: Planet;
  ship: Ship;
}
