import { useRealClock } from '../../util/useRealClock';
import { useGetPlanetService } from '../../state/selectors';
import React, { ReactElement } from 'react';
import { textures } from '../../data/textures';
import { BuildingComponent } from './BuildingComponent';
import { Planet } from '../../object/Planet';
import { PlanetData } from '../../service/PlanetService';
import { PlanetStorageComponent } from './PlanetStorageComponent';
import { Resource } from '../../object/Resource';
import { ProductionSlot } from './ProductionSlot';
import { BuildingResourceProductionData } from '../../object/building/types';

export function SelectedPlanetModal({ planet }: SelectedPlanetModalProps) {
  useRealClock({ interval: 250 });
  let { id } = planet;
  let planetService = useGetPlanetService();
  let planetData = planetService.getPlanetData(id);
  let { innerWidth } = window;
  let width = 1200;
  let remainingSpace = innerWidth - width;

  return (
    <div
      style={{
        position: 'fixed',
        top: 100,
        bottom: 0,
        left: remainingSpace / 2,
        right: remainingSpace / 2,
        zIndex: 1000,
        outline: 0,
        width,
        height: '600px',
        borderRadius: 12,
        backgroundColor: `rgb(192,192,192)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          paddingTop: '24px',
          paddingBottom: '12px',
          paddingLeft: '12px',
          alignItems: 'center',
          backgroundColor: `rgb(192,192,192)`,
        }}
      >
        <img
          src={planet.texture}
          style={{ width: '32px', height: '32px' }}
          alt={'Planet texture'}
        />
        <span>Planet summary</span>
      </div>
      <hr />
      <div
        style={{
          backgroundColor: 'rgb(211,211,211)',
          width: '100%',
          height: '100%',
          paddingTop: '8px',
          paddingLeft: '24px',
        }}
      >
        {planetData && <PlanetColonizationComponentModal planet={planet} planetData={planetData} />}
      </div>
    </div>
  );
}

export interface SelectedPlanetModalProps {
  planet: Planet;
}

export function PlanetColonizationComponentModal({
  planet,
  planetData,
}: PlanetColonizationComponentModalProps) {
  let { storage } = planetData;
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <PlanetBuildingsModal planetData={planetData} planet={planet} />
        <PlanetProductionModal planet={planet} planetData={planetData} />
      </div>
      <hr />
      <div
        style={{
          background: 'rgb(192,192,192)',
          boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
          maxWidth: '240px',
          minHeight: '140px',
        }}
      >
        <PlanetStorageComponent storage={storage} />
      </div>
    </div>
  );
}

export interface PlanetColonizationComponentModalProps {
  planet: Planet;
  planetData: PlanetData;
}

export function PlanetBuildingsModal({
  planet,
  planetData,
}: PlanetColonizationComponentModalProps) {
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
      <div>Buildings</div>
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

export function BuildingSlot({ children }: BuildingSlotProps) {
  return (
    <div
      style={{
        width: '36px',
        minWidth: '36px',
        height: '36px',
        minHeight: '36px',
        background: `url(${textures.panel_beige})`,
        backgroundSize: 'contain',
        padding: '8px',
        margin: '4px',
      }}
    >
      {children}
    </div>
  );
}

export interface BuildingSlotProps {
  children: ReactElement | ReactElement[];
}

export function PlanetProductionModal({ planet, planetData }: PlanetProductionModalProps) {
  let productions: Record<string, BuildingResourceProductionData> = {};
  planetData.buildings.forEach(building => {
    let { production } = building;
    Object.keys(production).forEach(resource => {
      let productionData = { ...production[resource as Resource]! };
      let previous = productions[resource];
      if (previous) {
        previous.produces += productionData?.produces;
      } else {
        productions[resource] = productionData;
      }
    });
  });

  return (
    <div
      style={{
        background: 'rgb(192,192,192)',
        // border: '4px solid rgb(119,136,153)',
        width: `200px`,
        padding: '12px',
        boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
        marginLeft: '12px',
      }}
    >
      Production
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '8px',
        }}
      >
        {Object.values(productions).map((productionData, index) => (
          <ProductionSlot production={productionData} key={index} />
        ))}
      </div>
    </div>
  );
}

export interface PlanetProductionModalProps {
  planet: Planet;
  planetData: PlanetData;
}
