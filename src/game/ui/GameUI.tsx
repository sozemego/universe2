import React from 'react';
import { SelectedObject } from './SelectedObject';
import { GameOptionsComponent } from './GameOptionsComponent';
import { GameClockComponent } from './GameClockComponent';
import { ObjectListComponent } from './ObjectListComponent';
import { ServiceStatsComponent } from './ServiceStatsComponent';
import { CameraComponent } from './CameraComponent';

export function GameUI() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'white',
          width: '250px',
          height: '100%',
          border: '4px solid gray',
          borderRadius: '0px 0px 12px 0px',
          pointerEvents: 'all',
        }}
      >
        <SelectedObject />
      </div>
      <div
        style={{
          background: 'white',
          width: '250px',
          height: '100%',
          border: '4px solid gray',
          borderRadius: '0px 0px 12px 12px',
          textAlign: 'center',
          pointerEvents: 'all',
        }}
      >
        <GameClockComponent />
      </div>
      <div
        style={{
          background: 'white',
          width: '250px',
          height: '100vh',
          maxHeight: '100vh',
          borderLeft: '4px solid gray',
          borderBottom: '4px solid gray',
          borderRadius: '0px 0px 0px 12px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          pointerEvents: 'all',
        }}
      >
        <CameraComponent />
        <GameOptionsComponent />
        <ServiceStatsComponent />
        <ObjectListComponent />
      </div>
    </div>
  );
}

export interface GameUiProps {}
