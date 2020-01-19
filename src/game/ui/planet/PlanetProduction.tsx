import React from 'react';
import Text from 'antd/lib/typography/Text';
import { Progress } from 'antd';
import { BuildingResourceProductionData } from '../../object/building/types';
import { Resource, RESOURCE_DATA } from '../../object/Resource';
import { Planet } from '../../object/Planet';
import { PlanetData } from '../../service/PlanetService';
import { textures } from '../../data/textures';

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
        format={percent => <span style={{ color: produces ? 'black' : 'red' }}>{produces}/m</span>}
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

export function PlanetProduction({ planet, planetData }: PlanetProductionModalProps) {
  let productions: Record<string, BuildingResourceProductionData> = {};
  planetData.buildings.forEach(building => {
    let { production, population, populationNeeded } = building;
    let populationPercentFilled = population / populationNeeded;
    Object.keys(production).forEach(resource => {
      let productionData = { ...production[resource as Resource]! };
      let previous = productions[resource];
      if (previous) {
        previous.produces += productionData?.produces * populationPercentFilled;
      } else {
        productionData.produces *= populationPercentFilled;
        productions[resource] = productionData;
      }
    });
  });

  return (
    <div
      style={{
        background: 'rgb(192,192,192)',
        // border: '4px solid rgb(119,136,153)',
        width: `200px`,
        padding: '12px',
        boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
        marginLeft: '12px',
      }}
    >
      <Text type={'secondary'}>Production</Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '8px',
        }}
      >
        {Object.values(productions).map((productionData, index) => (
          <ProductionSlot production={productionData} key={index} />
        ))}
      </div>
    </div>
  );
}

export interface PlanetProductionModalProps {
  planet: Planet;
  planetData: PlanetData;
}
