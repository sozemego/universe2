import uuid from 'uuid/v4';
import { Planet } from '../object/Planet';
import { BUILDINGS } from '../data/buildings';
import { Building } from '../object/building/Building';
import { BuildingProductionData, BuildingType } from '../object/building/types';

export class BuildingFactory {
  createBuilding(type: BuildingType, planet: Planet): Building {
    let buildingData = BUILDINGS[type];
    let { texture, name } = buildingData;
    let production = this._getProduction(type);
    let building = new Building(uuid(), planet, texture, name, production);

    return building;
  }

  _getProduction(type: BuildingType): BuildingProductionData {
    let buildingData = BUILDINGS[type];
    let { production } = buildingData;
    return JSON.parse(JSON.stringify(production));
  }
}
