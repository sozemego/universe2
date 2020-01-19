import React, { ReactElement } from 'react';
import Text from 'antd/lib/typography/Text';
import { Tooltip } from 'antd';
import { Building } from '../../object/building/Building';
import { textures } from '../../data/textures';
import { Resource, RESOURCE_DATA } from '../../object/Resource';

export function BuildingComponent({ building }: BuildingComponentProps) {
  let { name, texture, population, populationNeeded } = building;
  return (
    <div>
      <Tooltip
        title={<BuildingTooltip building={building} />}
        placement={'right'}
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
      >
        <img src={texture} alt={name} style={{ maxWidth: '36px' }} />
        <Text style={{ fontSize: '0.8rem', marginLeft: '6px' }}>
          {population}/{populationNeeded}
        </Text>
      </Tooltip>
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

export function BuildingTooltip({ building }: BuildingTooltipProps) {
  let { description, population, populationNeeded, production } = building;
  let populationFilledPercent = population / populationNeeded;
  return (
    <div>
      <div>{description}</div>
      <div>
        Population: {population} / {populationNeeded}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>Produces:</div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {Object.keys(production).map(resource => {
            let productionData = production[resource as Resource]!;
            let maxProduces = productionData?.produces;
            let realProduces = maxProduces * populationFilledPercent;
            let producesColor = 'yellow';
            if (maxProduces === realProduces) {
              producesColor = 'green';
            } else if (realProduces === 0) {
              producesColor = 'red';
            } else {
              producesColor = 'gray';
            }
            return (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <img
                  src={RESOURCE_DATA[resource as Resource].texture}
                  style={{ width: '12px', height: '12px' }}
                  alt={resource}
                />
                <div style={{ color: producesColor }}>
                  {maxProduces}/{realProduces}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface BuildingTooltipProps {
  building: Building;
}
