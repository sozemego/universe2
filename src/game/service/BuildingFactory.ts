import uuid from 'uuid/v4';
import { BUILDINGS } from '../data/buildings';
import { Building } from '../object/building/Building';
import { BuildingProductionData, BuildingType } from '../object/building/types';

export class BuildingFactory {
  createBuilding(type: BuildingType): Building {
    let buildingData = BUILDINGS[type];
    let { texture, name, populationNeeded, description } = buildingData;
    let production = this._getProduction(type);
    let building = new Building(uuid(), texture, name, description, production, populationNeeded);

    return building;
  }

  _getProduction(type: BuildingType): BuildingProductionData {
    let buildingData = BUILDINGS[type];
    let { production } = buildingData;
    return JSON.parse(JSON.stringify(production));
  }
}
