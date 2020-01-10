import React from 'react';
import { useRealClock } from '../util/useRealClock';
import { Star } from '../object/Star';

export function SelectedStar({ star }: SelectedStarProps) {
  useRealClock({ interval: 1000 });

  const position = `x: ${star.position.x.toFixed(0)}, y: ${star.position.y.toFixed(0)}`;
  const velocity = `x: ${star.velocity.x.toFixed(2)}, y: ${star.velocity.y.toFixed(2)}`;
  const mass = star.mass;
  const solarSystem = star.solarSystem;
  const planetCount = solarSystem?.planets.length || 0;
  const starCount = solarSystem?.stars.length || 0;

  return (
    <div>
      <div>{star.name}</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img alt={'star'} src={star.texture} style={{ width: 64, height: 64 }} />
      </div>
      <div>
        <span>Id:</span>
        <span style={{ fontSize: '0.75em', marginLeft: '4px' }}>{star.id}</span>
      </div>
      <div>Mass: {mass.toFixed(0)}</div>
      <div>
        <div>Position</div>
        <div>{position}</div>
      </div>
      <div>
        <div>Velocity</div>
        <div>{velocity}</div>
      </div>
      <div>Planets: {planetCount}</div>
      <div>Stars: {starCount}</div>
    </div>
  );
}

export interface SelectedStarProps {
  star: Star;
}
