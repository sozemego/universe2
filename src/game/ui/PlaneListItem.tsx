import React from 'react';
import { Divider } from 'antd';
import { Planet } from '../object/Planet';
import { useGetMoveToSelectionService, useGetSelectionService } from '../state/selectors';

export function PlanetListItem({ planet }: PlanetListItemProps) {
  let moveToSelectionService = useGetMoveToSelectionService();
  let selectionService = useGetSelectionService();

  let { id, position, acceleration, mass, radius, texture } = planet;
  let positionStr = `x: ${position.x.toFixed(0)}, y: ${position.y.toFixed(0)}`;
  let accelerationStr = `x: ${acceleration.x.toFixed(0)}, y: ${acceleration.y.toFixed(0)}`;

  return (
    <div
      style={{ cursor: 'pointer' }}
      onClick={() => {
        selectionService.selected = planet;
        moveToSelectionService.showSelection(false);
      }}
    >
      <div>
        <span>Id: </span>
        <span style={{ fontSize: '0.5rem', color: 'gray' }}>{id}</span>
      </div>
      <img src={texture} style={{ width: '24px', height: '24px' }} alt={'Planet texture'} />
      <div>
        <span>Mass: {mass.toFixed(0)}</span>
      </div>
      <div>
        <span>Radius: {radius.toFixed(0)}</span>
      </div>
      <div>
        <span>Position: {positionStr}</span>
      </div>
      <div>
        <span>Acceleration: {accelerationStr}</span>
      </div>
      <Divider />
    </div>
  );
}

export interface PlanetListItemProps {
  planet: Planet;
}
