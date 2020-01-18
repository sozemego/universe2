import React from 'react';
import { Progress } from 'antd';
import { RESOURCE_DATA } from '../../object/Resource';
import { textures } from '../../data/textures';
import { BuildingResourceProductionData } from '../../object/building/types';

export function ProductionSlot({ production }: ProductionSlotProps) {
  let { resource, produces, timePassed } = production;
  return (
    <div
      style={{
        margin: '4px',
        width: '64px',
        height: '64x',
        minWidth: '64px',
        minHeight: '64px',
      }}
    >
      <div
        style={{
          background: `url(${textures.production_slot_bg})`,
          backgroundSize: 'cover',
          width: '64px',
          height: '64px',
          minWidth: '64px',
          minHeight: '64px',
          position: 'absolute',
        }}
      >
        <img
          src={RESOURCE_DATA[resource].texture}
          alt={`${resource} texture`}
          style={{
            opacity: 0.75,
            width: '100%',
          }}
        />
      </div>
      <Progress
        type="circle"
        percent={(timePassed / 60) * 100}
        format={percent => <span style={{ color: 'black' }}>{produces}/m</span>}
        width={48}
        strokeColor={'black'}
        style={{ position: 'relative', top: 8, left: 8 }}
      />
    </div>
  );
}

export interface ProductionSlotProps {
  production: BuildingResourceProductionData;
}
