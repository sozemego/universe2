import uuid from 'uuid/v4';
import { Planet } from '../object/Planet';
import { BUILDINGS } from '../data/buildings';
import { Building } from '../object/building/Building';
import { BuildingType } from '../object/building/types';

export class BuildingFactory {
  createBuilding(type: BuildingType, planet: Planet): Building {
    let buildingData = BUILDINGS[type];
    let { texture, name } = buildingData;

    let building = new Building(uuid(), planet, texture, name);

    return building;
  }
}
