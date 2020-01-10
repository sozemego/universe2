import React from 'react';
import { SelectedObject } from './SelectedObject';
import { GameOptionsComponent } from './GameOptionsComponent';
import { GameClockComponent } from './GameClockComponent';
import { SpawnObjectComponent } from './SpawnObjectComponent';

export function GameUI() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div
        style={{
          background: 'white',
          width: '250px',
          height: '100%',
          borderRight: '4px solid gray',
          borderBottom: '4px solid gray',
          borderRadius: '0px 0px 12px 0px',
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
        }}
      >
        <GameClockComponent />
      </div>
      <div
        style={{
          background: 'white',
          width: '250px',
          height: '100%',
          borderLeft: '4px solid gray',
          borderBottom: '4px solid gray',
          borderRadius: '0px 0px 0px 12px',
        }}
      >
        <GameOptionsComponent />
        <SpawnObjectComponent />
      </div>
    </div>
  );
}

export interface GameUiProps {}
