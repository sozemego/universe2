import React from 'react';
import { Building } from '../../object/building/Building';

export function BuildingComponent({ building }: BuildingComponentProps) {
  let { name, texture } = building;
  return <img src={texture} alt={name} style={{ maxWidth: '100%' }} />;
}

export interface BuildingComponentProps {
  building: Building;
}
