import React, { ReactElement } from 'react';
import { Building } from '../../object/building/Building';
import { textures } from '../../data/textures';

export function BuildingComponent({ building }: BuildingComponentProps) {
  let { name, texture } = building;
  return <img src={texture} alt={name} style={{ maxWidth: '100%' }} />;
}

export interface BuildingComponentProps {
  building: Building;
}

export function BuildingSlot({ children }: BuildingSlotProps) {
  return (
    <div
      style={{
        width: '36px',
        minWidth: '36px',
        height: '36px',
        minHeight: '36px',
        background: `url(${textures.panel_beige})`,
        backgroundSize: 'contain',
        padding: '8px',
        margin: '4px',
      }}
    >
      {children}
    </div>
  );
}

export interface BuildingSlotProps {
  children: ReactElement | ReactElement[];
}
