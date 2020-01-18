import { useRealClock } from '../../util/useRealClock';
import { useDispatch } from 'react-redux';
import { useGetPlanetService } from '../../state/selectors';
import { Modal } from 'antd';
import { setSelectedObjectIsModal } from '../../state/state';
import React, { ReactElement } from 'react';
import { textures } from '../../data/textures';
import { BuildingComponent } from './BuildingComponent';
import { Planet } from '../../object/Planet';
import { PlanetData } from '../../service/PlanetService';
import { PlanetStorageComponent } from './PlanetStorageComponent';

export function SelectedPlanetModal({ planet }: SelectedPlanetModalProps) {
  useRealClock({ interval: 250 });
  let dispatch = useDispatch();
  let { id } = planet;
  let planetService = useGetPlanetService();
  let planetData = planetService.getPlanetData(id);

  return (
    <Modal
      visible={true}
      width={'1200px'}
      title={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <img
            src={planet.texture}
            alt={`Planet texture`}
            style={{ width: '32px', height: '32px' }}
          />
          <span style={{ marginLeft: '6px' }}>Planet info</span>
        </div>
      }
      onCancel={() => {
        // @ts-ignore
        dispatch(setSelectedObjectIsModal(false));
      }}
      onOk={() => {
        // @ts-ignore
        dispatch(setSelectedObjectIsModal(false));
      }}
    >
      {planetData && <PlanetColonizationComponentModal planet={planet} planetData={planetData} />}
    </Modal>
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
      <PlanetBuildingsModal planetData={planetData} planet={planet} />
      <hr />
      <div>
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
    <div>
      <div>Buildings:</div>
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
          <BuildingSlot>
            <BuildingComponent building={building} key={building.id} />
          </BuildingSlot>
        ))}
        {freeSpots.map(spot => (
          <BuildingSlot children={[]} />
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
        background: `url(${textures.grey_panel})`,
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
