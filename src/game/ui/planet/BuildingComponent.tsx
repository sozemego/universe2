import React, { ReactElement } from 'react';
import Text from 'antd/lib/typography/Text';
import { Building } from '../../object/building/Building';
import { textures } from '../../data/textures';

export function BuildingComponent({ building }: BuildingComponentProps) {
  let { name, texture, population, populationNeeded } = building;
  return (
    <div>
      <img src={texture} alt={name} style={{ maxWidth: '36px' }} />
      <Text style={{ fontSize: '0.8rem', marginLeft: '6px' }}>
        {population}/{populationNeeded}
      </Text>
    </div>
  );
}

export interface BuildingComponentProps {
  building: Building;
}

export function BuildingSlot({ children }: BuildingSlotProps) {
  return (
    <div
      style={{
        width: '48px',
        minWidth: '48px',
        height: '48px',
        minHeight: '48px',
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
