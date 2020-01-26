import React from 'react';
import { useGetCamera } from '../state/selectors';
import { useRealClock } from '../util/useRealClock';

export function CameraComponent() {
  useRealClock({ interval: 250 });
  let camera = useGetCamera();

  let x = camera.position.x.toFixed(0);
  let y = camera.position.y.toFixed(0);
  let z = camera.position.z.toFixed(0);

  return (
    <div>
      <div>Camera</div>
      <span style={{ margin: '2px' }}>x: {x}</span>
      <span style={{ margin: '2px' }}>y: {y}</span>
      <span style={{ margin: '2px' }}>z: {z}</span>
      <hr />
    </div>
  );
}
