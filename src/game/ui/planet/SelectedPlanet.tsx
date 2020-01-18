import React from 'react';
import { Progress, Tag } from 'antd';
import { useDispatch } from 'react-redux';
import { Planet } from '../../object/Planet';
import { useRealClock } from '../../util/useRealClock';
import { useGetPlanetService } from '../../state/selectors';
import { PlanetData } from '../../service/PlanetService';
import { RESOURCE_DATA } from '../../object/Resource';
import { textures } from '../../data/textures';
import { BuildingResourceProductionData } from '../../object/building/types';
import { setSelectedObjectIsModal } from '../../state/state';
import { BuildingComponent } from './BuildingComponent';
import { PlanetStorageComponent } from './PlanetStorageComponent';

export function SelectedPlanet({ planet }: SelectedPlanetProps) {
  useRealClock({ interval: 250 });
  let planetService = useGetPlanetService();
  let dispatch = useDispatch();

  let { id, texture } = planet;
  let planetData = planetService.getPlanetData(id);

  return (
    <div style={{ paddingTop: '52px', paddingBottom: '8px' }}>
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
          <>
            <BuildingComponent building={building} key={building.id} />
            <hr />
          </>
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

export function ProductionSlot({ production }: ProductionSlotProps) {
  let { resource, produces, timePassed, time } = production;
  return (
    <div
      style={{
        margin: '4px',
        width: '105px',
      }}
    >
      <img
        src={RESOURCE_DATA[resource].texture}
        alt={`${resource} texture`}
        style={{
          width: '32px',
          height: '32px',
          minWidth: '32px',
          minHeight: '32px',
          background: `url(${textures.production_slot_bg})`,
          backgroundSize: 'cover',
        }}
      />
      <span style={{ color: 'green' }}>+{produces}</span>
      <Progress
        type="circle"
        percent={(timePassed / time) * 100}
        format={percent => `${percent?.toFixed(0)}%`}
        width={32}
      />
    </div>
  );
}

export interface ProductionSlotProps {
  production: BuildingResourceProductionData;
}
