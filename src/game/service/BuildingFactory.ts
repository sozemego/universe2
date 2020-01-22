import uuid from 'uuid/v4';
import { BUILDINGS } from '../data/buildings';
import { Building } from '../object/building/Building';
import { BuildingConstructionData, BuildingData, BuildingType } from '../object/building/types';

export class BuildingFactory {
  createBuilding(type: BuildingType): Building {
    let buildingData = this._getBuildingData(type);
    let { texture, name, populationNeeded, description, production } = buildingData;
    let building = new Building(uuid(), texture, name, description, production, populationNeeded);

    return building;
  }

  _getBuildingData(type: BuildingType): BuildingData {
    let buildingData = BUILDINGS[type];
    return JSON.parse(JSON.stringify(buildingData));
  }

  getBuildingConstructionData(type: BuildingType): BuildingConstructionData {
    let buildingData = this._getBuildingData(type);
    return buildingData.cost;
  }
}
