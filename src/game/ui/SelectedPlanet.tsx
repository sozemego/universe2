import React from 'react';
import { Planet } from '../object/Planet';
import { useRealClock } from '../util/useRealClock';
import { useGetPlanetService } from '../state/selectors';
import { PlanetData } from '../service/PlanetService';
import { Building } from '../object/building/Building';

export function SelectedPlanet({ planet }: SelectedPlanetProps) {
  useRealClock({ interval: 1000 });
  let planetService = useGetPlanetService();

  let { id, texture, mass } = planet;
  let planetData = planetService.getPlanetData(id);

  return (
    <div style={{ paddingTop: '64px' }}>
      <div style={{ backgroundColor: 'gray', display: 'flex', justifyContent: 'center' }}>
        <img src={texture} alt={'Planet texture'} style={{ padding: '8px' }} />
      </div>
      <div>
        <span>Id:</span>
        <span style={{ fontSize: '0.75em', marginLeft: '4px' }}>{id}</span>
      </div>
      <hr />
      {planetData && <PlanetColonizationComponent planet={planet} planetData={planetData} />}
    </div>
  );
}

export interface SelectedPlanetProps {
  planet: Planet;
}

export function PlanetColonizationComponent({ planet, planetData }: PlanetColonizationComponent) {
  let { population, buildings } = planetData;
  return (
    <div>
      <div>Population: {population.toFixed(0)}</div>
      <div>
        <div>Buildings:</div>
        {buildings.map(building => (
          <BuildingComponent building={building} />
        ))}
      </div>
    </div>
  );
}

export interface PlanetColonizationComponent {
  planet: Planet;
  planetData: PlanetData;
}

export function BuildingComponent({ building }: BuildingComponentProps) {
  let { name, texture } = building;
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <img src={texture} style={{ width: '24px', height: '24px' }} />
        <div>{name}</div>
      </div>
    </div>
  );
}

export interface BuildingComponentProps {
  building: Building;
}
