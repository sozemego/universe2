import React from 'react';
import { Planet } from '../object/Planet';
import { useRealClock } from '../util/useRealClock';
import { useGetPlanetService } from '../state/selectors';
import { PlanetData } from '../service/PlanetService';
import { Building } from '../object/building/Building';
import { PlanetStorage } from '../object/PlanetStorage';
import { Resource, RESOURCE_DATA } from '../object/Resource';

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

export function PlanetColonizationComponent({
  planet,
  planetData,
}: PlanetColonizationComponentProps) {
  let { population, buildings, storage } = planetData;
  return (
    <div>
      <div>Population: {population.toFixed(0)}</div>
      <div>
        <div>Buildings:</div>
        {buildings.map(building => (
          <BuildingComponent building={building} />
        ))}
      </div>
      <PlanetStorageComponent storage={storage} />
    </div>
  );
}

export interface PlanetColonizationComponentProps {
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

export function PlanetStorageComponent({ storage }: PlanetStorageComponentProps) {
  let { resources } = storage;
  return (
    <div>
      <hr />
      <div>Storage</div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {Object.entries(resources)
          .filter(entry => entry[1] > 0)
          .map(([resource, count]) => {
            return <StorageSlot resource={resource as Resource} count={count} />;
          })}
      </div>
    </div>
  );
}

export interface PlanetStorageComponentProps {
  storage: PlanetStorage;
}

export function StorageSlot({ resource, count }: StorageSlotProps) {
  return (
    <div
      style={{
        margin: '4px',
        backgroundColor: 'gray',
        padding: '4px',
        borderRadius: '4px',
        width: '70px',
        minWidth: '70px',
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={RESOURCE_DATA[resource].texture}
        alt={`${resource} texture`}
        style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
      />
      <span>{count}</span>
    </div>
  );
}

export interface StorageSlotProps {
  resource: Resource;
  count: number;
}
