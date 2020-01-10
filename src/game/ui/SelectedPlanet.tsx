import React from 'react';
import { Planet } from '../object/Planet';
import { useRealClock } from '../util/useRealClock';

export function SelectedPlanet({ planet }: SelectedPlanetProps) {
  const velocity = `x: ${planet.velocity.x.toFixed(2)}, y: ${planet.velocity.y.toFixed(2)}`;

  useRealClock({ interval: 1000 });

  return (
    <div>
      <div>
        <div>
          <span>Id:</span>
          <span style={{ fontSize: '0.75em', marginLeft: '4px' }}>{planet.id}</span>
        </div>
        <div>Acceleration</div>
        <div>{velocity}</div>
      </div>
    </div>
  );
}

export interface SelectedPlanetProps {
  planet: Planet;
}
