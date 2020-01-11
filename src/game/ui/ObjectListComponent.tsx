import React from 'react';
import {
  useGetMoveToSelectionService,
  useGetSelectionService,
  useGetUniverse,
} from '../state/selectors';
import { useRealClock } from '../util/useRealClock';
import { SolarSystemListItem } from './SolarSystemListItem';

export function ObjectListComponent() {
  let universe = useGetUniverse();
  let moveToSelectionService = useGetMoveToSelectionService();
  let selectionService = useGetSelectionService();

  useRealClock({ interval: 1000 });

  return (
    <div style={{ margin: '8px' }}>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          selectionService.selected = universe.centerStar;
          moveToSelectionService.showSelection(false);
        }}
      >
        <div>Center black hole:</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={universe.centerStar.texture}
            alt={'Center black hole texture'}
            style={{ width: '36px', height: '36px', textAlign: 'center' }}
          />
        </div>
      </div>
      <div>Solar systems:</div>
      {universe.solarSystems.map(solarSystem => (
        <SolarSystemListItem solarSystem={solarSystem} key={solarSystem.id} />
      ))}
      <div>Free planets:</div>
    </div>
  );
}
