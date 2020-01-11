import React from 'react';
import { SolarSystem } from '../object/SolarSystem';
import { Divider } from 'antd';
import { useGetMoveToSelectionService, useGetSelectionService } from '../state/selectors';

export function SolarSystemListItem({ solarSystem }: SolarSystemListItemProps) {
  let moveToSelectionService = useGetMoveToSelectionService();
  let selectionService = useGetSelectionService();

  let { id, stars, planets, radius, position } = solarSystem;

  const positionStr = `x: ${position.x.toFixed(0)}, y: ${position.y.toFixed(0)}`;

  return (
    <div>
      <div>Solar system</div>
      <div>
        <span>Id: </span>
        <span style={{ fontSize: '0.5rem', color: 'gray' }}>{id}</span>
      </div>
      <div>
        <span>Radius: {radius.toFixed(0)}</span>
      </div>
      <div>
        <span>Position: {positionStr}</span>
      </div>
      <div style={{ cursor: 'pointer' }}>
        {stars.map(star => (
          <img
            key={star.id}
            style={{ width: '24px', height: '24px' }}
            src={star.texture}
            alt={'Star texture'}
            onClick={() => {
              selectionService.selected = star;
              moveToSelectionService.showSelection(false);
            }}
          />
        ))}
      </div>
      <div style={{ cursor: 'pointer' }}>
        {planets.map(planet => (
          <img
            key={planet.id}
            style={{ width: '24px', height: '24px' }}
            src={planet.texture}
            alt={'Planet texture'}
            onClick={() => {
              selectionService.selected = planet;
              moveToSelectionService.showSelection(false);
            }}
          />
        ))}
      </div>
      <Divider />
    </div>
  );
}

export interface SolarSystemListItemProps {
  solarSystem: SolarSystem;
}
