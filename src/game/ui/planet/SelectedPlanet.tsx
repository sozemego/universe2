import React from 'react';
import Text from 'antd/lib/typography/Text';
import { useDispatch } from 'react-redux';
import { Tag } from 'antd';
import { Planet } from '../../object/Planet';
import { useRealClock } from '../../util/useRealClock';
import { useGetPlanetColonizationService, useGetPlanetService } from '../../state/selectors';
import { PlanetData } from '../../service/PlanetService';
import { setSelectedObjectIsModal } from '../../state/state';
import { BuildingComponent, BuildingSlot } from './SelectedPlanetModal';

export function SelectedPlanet({ planet }: SelectedPlanetProps) {
  useRealClock({ interval: 250 });
  let planetService = useGetPlanetService();
  let dispatch = useDispatch();

  let { id, texture } = planet;
  let planetData = planetService.getPlanetData(id);

  return (
    <div style={{ paddingTop: '12px', paddingBottom: '8px', backgroundColor: 'rgb(211,211,211)' }}>
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        onClick={() => {
          // @ts-ignore
          dispatch(setSelectedObjectIsModal(true));
        }}
      >
        <Tag color={'gold'} style={{ cursor: 'pointer' }}>
          Expand >>
        </Tag>
      </div>
      <div style={{ backgroundColor: 'gray', display: 'flex', justifyContent: 'center' }}>
        <img src={texture} alt={'Planet texture'} style={{ padding: '8px' }} />
      </div>
      <div>
        <span>Id:</span>
        <span style={{ fontSize: '0.75em', marginLeft: '4px' }}>{id}</span>
      </div>
      <hr />
      {planetData && <PlanetColonizationComponent planet={planet} planetData={planetData} />}
      {!planetData && <ColonizePlanet planet={planet} />}
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <PlanetShips planetData={planetData} />
    </div>
  );
}

export interface PlanetColonizationComponentProps {
  planet: Planet;
  planetData: PlanetData;
}

export function PlanetShips({ planetData }: PlanetShipsProps) {
  let { ships } = planetData;
  return (
    <div
      style={{
        maxHeight: '480px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <Text type={'secondary'}>Ships</Text>
      {ships.map(ship => (
        <div
          key={ship.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            border: '1px solid gray',
            backgroundColor: 'rgb(169,169,169)',
            margin: '6px',
            padding: '4px',
            cursor: 'pointer',
            alignItems: 'center',
            width: '95%',
          }}
        >
          <img
            src={ship.texture}
            alt={ship.name + 'texture'}
            style={{ width: '32px', height: '32px' }}
          />
          <Text>{ship.name}</Text>
        </div>
      ))}
    </div>
  );
}

export interface PlanetShipsProps {
  planetData: PlanetData;
}

export function ColonizePlanet({ planet }: ColonizePlanetProps) {
  let planetColonizationService = useGetPlanetColonizationService();
  let canColonize = planetColonizationService.canColonize(planet);
  return (
    <div>
      <Tag
        onClick={() => {
          if (canColonize) {
            planetColonizationService.colonizePlanet(planet);
          }
        }}
        style={{ cursor: 'pointer' }}
        color={canColonize ? 'green' : 'red'}
      >
        Colonize
      </Tag>
    </div>
  );
}

export interface ColonizePlanetProps {
  planet: Planet;
}

export function PlanetBuildings({ planet, planetData }: PlanetBuildingsProps) {
  let { buildings } = planetData;
  let freeSpots = Array.from({ length: 16 - buildings.length });
  return (
    <div
      style={{
        width: `200px`,
        padding: '12px',
        background: 'rgb(192,192,192)',
        boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
      }}
    >
      <Text type={'secondary'}>Buildings</Text>
      <div
        style={{
          maxWidth: `${44 * 4}px`,
          minWidth: `${44 * 4}px`,
          maxHeight: `${44 * 4}px`,
          minHeight: `${44 * 4}px`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {buildings.map(building => (
          <BuildingSlot key={building.id}>
            <BuildingComponent building={building} />
          </BuildingSlot>
        ))}
        {freeSpots.map((spot, index) => (
          <BuildingSlot children={[]} key={index} />
        ))}
      </div>
    </div>
  );
}

export interface PlanetBuildingsProps {
  planet: Planet;
  planetData: PlanetData;
}
