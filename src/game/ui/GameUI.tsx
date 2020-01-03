import React from 'react';
import { SelectedObject } from './SelectedObject';
import { GameOptionsComponent } from './GameOptionsComponent';

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
            borderRadius: "0px 0px 12px 0px"
        }}
      >
        <SelectedObject />
      </div>
      <div
        style={{
          background: 'white',
          width: '250px',
          height: '100%',
          borderLeft: '4px solid gray',
          borderBottom: '4px solid gray',
            borderRadius: "0px 0px 0px 12px"
        }}
      >
        <GameOptionsComponent />
      </div>
    </div>
  );
}

export interface GameUiProps {}
