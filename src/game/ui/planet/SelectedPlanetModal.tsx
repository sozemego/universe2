import React from 'react';
import Text from 'antd/lib/typography/Text';
import { useRealClock } from '../../util/useRealClock';
import { useGetPlanetService } from '../../state/selectors';
import { BuildingComponent, BuildingSlot } from './BuildingComponent';
import { Planet } from '../../object/Planet';
import { PlanetData } from '../../service/PlanetService';
import { PlanetStorageComponent } from './PlanetStorageComponent';
import { Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { setSelectedObjectIsModal } from '../../state/state';
import { PlanetProduction } from './PlanetProduction';

export function SelectedPlanetModal({ planet }: SelectedPlanetModalProps) {
  useRealClock({ interval: 250 });
  let dispatch = useDispatch();
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
          justifyContent: 'space-between',
        }}
      >
        <div>
          <img
            src={planet.texture}
            style={{ width: '32px', height: '32px' }}
            alt={'Planet texture'}
          />
          <Text strong>Planet summary</Text>
        </div>
        <Icon
          type="close-circle"
          theme="twoTone"
          style={{ marginRight: '12px', transform: 'scale(2)', cursor: 'pointer' }}
          onClick={() => {
            // @ts-ignore
            dispatch(setSelectedObjectIsModal(false));
          }}
        />
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
        <PlanetProduction planet={planet} planetData={planetData} />
      </div>
      <hr />
      <div
        style={{
          background: 'rgb(192,192,192)',
          boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
          maxWidth: '260px',
          minHeight: '260px',
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
