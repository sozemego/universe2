import { Resource, RESOURCE_DATA } from '../../object/Resource';
import React from 'react';
import { textures } from '../../data/textures';
import { PlanetStorage } from '../../object/PlanetStorage';

export function PlanetStorageComponent({ storage }: PlanetStorageComponentProps) {
  let { resources } = storage;
  return (
    <div>
      <div>Storage</div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {Object.entries(resources).map(([resource, count]) => {
          return <StorageSlot resource={resource as Resource} count={count} key={resource} />;
        })}
      </div>
    </div>
  );
}

export interface PlanetStorageComponentProps {
  storage: PlanetStorage;
}

export function StorageSlot({ resource, count }: StorageSlotProps) {
  return (
    <div
      style={{
        margin: '4px',
        backgroundColor: 'gray',
        padding: '4px',
        borderRadius: '4px',
        width: '70px',
        minWidth: '70px',
        height: '48px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: `url(${textures.glass_panel_2})`,
        backgroundSize: '100% 100%',
      }}
    >
      <img
        src={RESOURCE_DATA[resource].texture}
        alt={`${resource} texture`}
        style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
      />
      <span>{count}</span>
    </div>
  );
}

export interface StorageSlotProps {
  resource: Resource;
  count: number;
}
