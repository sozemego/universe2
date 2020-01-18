import React from 'react';
import { Progress } from 'antd';
import { RESOURCE_DATA } from '../../object/Resource';
import { textures } from '../../data/textures';
import { BuildingResourceProductionData } from '../../object/building/types';

export function ProductionSlot({ production }: ProductionSlotProps) {
  let { resource, produces, timePassed, time } = production;
  return (
    <div
      style={{
        margin: '4px',
        width: '48px',
        height: '48x',
        minWidth: '48px',
        minHeight: '48px',
      }}
    >
      <div
        style={{
          background: `url(${textures.production_slot_bg})`,
          backgroundSize: 'cover',
          width: '48px',
          height: '48px',
          minWidth: '48px',
          minHeight: '48px',
          position: 'absolute',
        }}
      >
        <img
          src={RESOURCE_DATA[resource].texture}
          alt={`${resource} texture`}
          style={{
            opacity: 0.5,
            width: '100%',
          }}
        />
      </div>
      <Progress
        type="circle"
        percent={(timePassed / time) * 100}
        format={percent => <span style={{ color: 'black' }}>+{produces}</span>}
        width={32}
        strokeColor={'black'}
        style={{ position: 'relative', top: 8, left: 8 }}
      />
    </div>
  );
}

export interface ProductionSlotProps {
  production: BuildingResourceProductionData;
}
