import React, { ReactElement } from 'react';
import { Icon, Progress, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import { useDispatch } from 'react-redux';
import { useRealClock } from '../../util/useRealClock';
import { useGetPlanetService } from '../../state/selectors';
import { Planet } from '../../object/Planet';
import { BuildingConstruction, PlanetData } from '../../service/PlanetService';
import { setSelectedObjectIsModal } from '../../state/state';
import { Resource, RESOURCE_DATA } from '../../object/Resource';
import { PlanetStorage } from '../../object/PlanetStorage';
import { textures } from '../../data/textures';
import { Building } from '../../object/building/Building';
import { BuildingData, BuildingResourceProductionData } from '../../object/building/types';
import { BUILDINGS } from '../../data/buildings';

export function SelectedPlanetModal({ planet }: SelectedPlanetModalProps) {
  useRealClock({ interval: 250 });
  let dispatch = useDispatch();
  let { id, name, texture } = planet;
  let planetService = useGetPlanetService();
  let planetData = planetService.getPlanetData(id);
  let { innerWidth } = window;
  let width = 1200;
  let remainingSpace = innerWidth - width;

  return (
    <div
      style={{
        position: 'fixed',
        top: 100,
        bottom: 0,
        left: remainingSpace / 2,
        right: remainingSpace / 2,
        zIndex: 1000,
        outline: 0,
        width,
        height: '600px',
        borderRadius: 12,
        backgroundColor: `rgb(192,192,192)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          paddingTop: '24px',
          paddingBottom: '12px',
          paddingLeft: '12px',
          alignItems: 'center',
          backgroundColor: `rgb(192,192,192)`,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <img src={texture} style={{ width: '32px', height: '32px' }} alt={'Planet texture'} />
          <Text strong style={{ marginLeft: '4px' }}>
            {name}
          </Text>
        </div>
        <Icon
          type="close-circle"
          theme="twoTone"
          style={{ marginRight: '12px', transform: 'scale(2)', cursor: 'pointer' }}
          onClick={() => {
            // @ts-ignore
            dispatch(setSelectedObjectIsModal(false));
          }}
        />
      </div>
      <hr />
      <div
        style={{
          backgroundColor: 'rgb(211,211,211)',
          width: '100%',
          height: '100%',
          paddingTop: '8px',
          paddingLeft: '24px',
        }}
      >
        {planetData && <PlanetColonizationComponentModal planet={planet} planetData={planetData} />}
      </div>
    </div>
  );
}

export interface SelectedPlanetModalProps {
  planet: Planet;
}

export function PlanetColonizationComponentModal({
  planet,
  planetData,
}: PlanetColonizationComponentModalProps) {
  let { storage } = planetData;
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <PlanetBuildingsModal planetData={planetData} planet={planet} />
        <PlanetProduction planet={planet} planetData={planetData} />
      </div>
      <hr />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            background: 'rgb(192,192,192)',
            boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
            maxWidth: '260px',
            minHeight: '260px',
          }}
        >
          <PlanetStorageComponent storage={storage} />
        </div>
        <div
          style={{
            background: 'rgb(192,192,192)',
            marginLeft: '12px',
            boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
            maxWidth: '260px',
            minHeight: '260px',
            minWidth: '260px',
          }}
        >
          <PlanetPopulation planet={planet} planetData={planetData} />
        </div>
      </div>
    </div>
  );
}

export interface PlanetColonizationComponentModalProps {
  planet: Planet;
  planetData: PlanetData;
}

export function PlanetBuildingsModal({
  planet,
  planetData,
}: PlanetColonizationComponentModalProps) {
  let { buildings, constructions } = planetData;
  let freeSpots = Array.from({ length: 16 - buildings.length - constructions.length });
  let [showBuildingConstructionList, setShowBuildingConstructionList] = React.useState(false);
  return (
    <div
      style={{
        width: `250px`,
        padding: '12px',
        background: 'rgb(192,192,192)',
        boxShadow: '2px 2px 15px 4px rgba(128,128,128, 0.75)',
      }}
    >
      <Text type={'secondary'}>Buildings</Text>
      <div
        style={{
          maxWidth: `${64 * 4}px`,
          minWidth: `${64 * 4}px`,
          maxHeight: `${64 * 4}px`,
          minHeight: `${64 * 4}px`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {buildings.map(building => (
          <BuildingSlot key={building.id}>
            <BuildingComponent building={building} />
          </BuildingSlot>
        ))}
        {constructions.map(construction => (
          <BuildingSlot key={construction.building.id}>
            <BuildingConstructionComponent construction={construction} />
          </BuildingSlot>
        ))}
        {freeSpots.map((spot, index) => (
          <BuildingSlot key={index} hoverable={!showBuildingConstructionList}>
            <img
              src={textures.genericItem_color_006}
              alt={'Wrench'}
              style={{ width: '32px', height: '32px' }}
              onClick={() => setShowBuildingConstructionList(true)}
            />
          </BuildingSlot>
        ))}
        {showBuildingConstructionList && (
          <ConstructableBuildingList
            planetData={planetData}
            onClose={() => setShowBuildingConstructionList(false)}
          />
        )}
      </div>
    </div>
  );
}

export function PlanetStorageComponent({ storage }: PlanetStorageComponentProps) {
  let { resources } = storage;
  return (
    <div style={{ padding: '12px' }}>
      <Text type={'secondary'}>Storage</Text>
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

export function BuildingComponent({ building }: BuildingComponentProps) {
  let { name, texture, population, maxPopulation } = building;
  return (
    <div>
      <Tooltip
        title={<BuildingTooltip building={building} />}
        placement={'right'}
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
      >
        <img
          src={texture}
          alt={name}
          style={{ maxWidth: '36px', maxHeight: '36px', width: '36px', height: '36px' }}
        />
        <Text style={{ fontSize: '0.8rem', marginLeft: '6px' }}>
          {population}/{maxPopulation}
        </Text>
      </Tooltip>
    </div>
  );
}

export interface BuildingComponentProps {
  building: Building;
}

export function BuildingSlot({ children, hoverable = false }: BuildingSlotProps) {
  let [mouseOver, setMouseOver] = React.useState(false);
  let background = textures.panel_beige;
  if (hoverable && mouseOver) {
    background = textures.panel_beigeLight;
  }
  return (
    <div
      style={{
        width: '48px',
        minWidth: '48px',
        height: '48px',
        minHeight: '48px',
        background: `url(${background}) 0% 0% / contain`,
        padding: '8px',
        margin: '4px',
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {children}
    </div>
  );
}

export interface BuildingSlotProps {
  children: ReactElement | ReactElement[];
  hoverable?: boolean;
}

export function BuildingConstructionComponent({
  construction,
}: BuildingConstructionComponentProps) {
  let { cost, building } = construction;
  let { texture, name } = building;
  return (
    <div style={{ cursor: 'default' }}>
      <div style={{ position: 'absolute' }}>
        <img
          src={texture}
          alt={name}
          style={{
            maxWidth: '36px',
            maxHeight: '36px',
            width: '36px',
            height: '36px',
            opacity: 0.5,
          }}
        />
      </div>
      <div style={{ position: 'relative' }}>
        <Progress
          type="circle"
          percent={(cost.framesPassed / cost.time) * 100}
          format={percent => ((cost.time - cost.framesPassed) / 60).toFixed(0)}
          width={36}
          strokeColor={'black'}
          style={{ position: 'relative', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
}

export interface BuildingConstructionComponentProps {
  construction: BuildingConstruction;
}

export function BuildingTooltip({ building }: BuildingTooltipProps) {
  let { description, population, maxPopulation, production } = building;
  return (
    <div>
      <div>{description}</div>
      {maxPopulation && (
        <div>
          Population: {population} / {maxPopulation}
        </div>
      )}
      {Object.keys(production).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div>Produces:</div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {Object.keys(production).map(resource => {
              let productionData = production[resource as Resource]!;
              let maxProduces = productionData?.produces * building.maxPopulation;
              let realProduces = productionData.produces * building.population;
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
                  <div style={{ color: producesColor }}>{realProduces}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export interface BuildingTooltipProps {
  building: Building;
}

export function ProductionSlot({ production }: ProductionSlotProps) {
  let { resource, produces, time, timePassed } = production;
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
        percent={(timePassed / time) * 100}
        format={percent => (
          <Text type={'secondary'} style={{ color: produces ? 'black' : 'red' }}>
            {produces}
          </Text>
        )}
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
    let { production, population, maxPopulation } = building;
    Object.keys(production).forEach(resource => {
      let productionData = { ...production[resource as Resource]! };
      let previous = productions[resource];
      if (previous) {
        previous.produces += productionData?.produces * population;
      } else {
        productionData.produces *= maxPopulation;
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

export function ConstructableBuildingList({ planetData, onClose }: ConstructableBuildingListProps) {
  let { innerWidth } = window;
  let width = 400;
  let remainingSpace = innerWidth - width;

  return (
    <div
      style={{
        position: 'fixed',
        top: 200,
        bottom: 0,
        left: remainingSpace / 2,
        right: remainingSpace / 2,
        zIndex: 1000,
        outline: 0,
        width,
        height: '600px',
        borderTop: '6px solid black',
        borderLeft: '4px solid black',
        borderRight: '4px solid black',
        borderBottom: '6px solid black',
        borderRadius: 18,
        backgroundColor: `rgb(112,128,144)`,
        padding: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text type={'secondary'}>Building list</Text>
        <Icon
          type="close-circle"
          theme="twoTone"
          style={{
            marginRight: '12px',
            marginBottom: '12px',
            marginTop: '8px',
            transform: 'scale(2)',
            cursor: 'pointer',
          }}
          onClick={onClose}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.values(BUILDINGS).map(building => (
          <ConstructableBuilding building={building} planetData={planetData} key={building.name} />
        ))}
      </div>
    </div>
  );
}

export interface ConstructableBuildingListProps {
  planetData: PlanetData;
  onClose: () => void;
}

export function ConstructableBuilding({ building, planetData }: ConstructableBuildingProps) {
  let [hover, setHover] = React.useState(false);
  let { cost, texture, description, populationNeeded, type, production } = building;
  let { storage, planet } = planetData;
  let planetService = useGetPlanetService();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid gray',
        backgroundColor: 'rgb(169,169,169)',
        boxShadow: `0px 0px 4px 2px ${hover ? 'white' : 'transparent'}`,
        marginBottom: '6px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => planetService.constructBuilding(planet, type)}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <BuildingSlot>
          <img src={texture} alt={'Building texture'} style={{ width: '32px', height: '32px' }} />
        </BuildingSlot>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {Object.keys(Resource)
                .filter(resource => cost[resource as Resource])
                .map(resource => {
                  let resourceCost = cost[resource as Resource];
                  let enough = storage.resources[resource as Resource] >= resourceCost!;
                  return (
                    <div key={resource}>
                      <img
                        src={RESOURCE_DATA[resource as Resource].texture}
                        style={{ width: '24px', height: '24px' }}
                        alt={resource}
                      />
                      <span style={{ color: enough ? 'black' : 'red' }}>{resourceCost}</span>
                    </div>
                  );
                })}
            </div>
            <div style={{ paddingLeft: '3px' }}>
              <img
                src={textures.hud_p1}
                alt={'Population'}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ paddingLeft: '6px' }}>{populationNeeded}</span>
            </div>
          </div>
          {Object.keys(production).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text type={'secondary'}>Produces</Text>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {Object.keys(production).map(resource => {
                  let productionData = production[resource as Resource]!;
                  return (
                    <div>
                      <img
                        src={RESOURCE_DATA[resource as Resource].texture}
                        style={{ width: '24px', height: '24px' }}
                        alt={resource + 'icon'}
                      />
                      <Text type={'secondary'}>{productionData.produces}</Text>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <span style={{ margin: '4px' }}>{description}</span>
    </div>
  );
}

export interface ConstructableBuildingProps {
  building: BuildingData;
  planetData: PlanetData;
}

export function PlanetPopulation({ planet, planetData }: PlanetPopulationProps) {
  let { population, buildings, populationGrowth } = planetData;
  let count = population.length;
  let {
    foodConsumedPerMinute,
    foodToGrow,
    foodStored,
    growing,
    timePassed,
    time,
  } = populationGrowth;
  let employedPopulation = buildings.reduce((sum, building) => sum + building.population, 0);
  let unemployedPopulation = count - employedPopulation;
  let totalJobs = buildings.reduce((sum, building) => sum + building.maxPopulation, 0);

  let foodConsumerPerMinuteForUpkeep = population.reduce(
    (sum, pop) => sum + pop.foodUsedPerMinute,
    0
  );

  return (
    <div style={{ padding: '12px' }}>
      <Text type={'secondary'}>Population</Text>
      <Tooltip title={'Total population of the planet'} mouseEnterDelay={0} mouseLeaveDelay={0}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img
              src={textures.hud_p1}
              alt={'Population icon'}
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
            />
            <div>{count}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text type={'secondary'}>Upkeep</Text>
            <img
              src={RESOURCE_DATA.FOOD.texture}
              style={{ width: '24px', height: '24px' }}
              alt={'Food icon'}
            />
            <Text type={'secondary'}>{foodConsumerPerMinuteForUpkeep}</Text>
          </div>
        </div>
      </Tooltip>
      <Tooltip title={'Unemployed population units'} mouseEnterDelay={0} mouseLeaveDelay={0}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img
            src={textures.unemployed_pop}
            alt={'Population icon'}
            style={{ width: '24px', height: '24px', marginRight: '8px' }}
          />
          <div>{unemployedPopulation}</div>
        </div>
      </Tooltip>
      <Tooltip
        title={'Occupied and total jobs on this planet'}
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img
            src={textures.gear_2}
            alt={'Population icon'}
            style={{ width: '24px', height: '24px', marginRight: '8px' }}
          />
          <div>
            {employedPopulation}/{totalJobs}
          </div>
        </div>
      </Tooltip>
      <div>{}</div>
      <div>
        <Text type={'secondary'}>Population growth</Text>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <img
              src={RESOURCE_DATA.FOOD.texture}
              alt={'Food icon'}
              style={{ width: '32px', height: '32px' }}
            />
            <Text type={'secondary'}>{foodConsumedPerMinute}</Text>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            marginLeft: '8px',
          }}
        >
          <Text type={'secondary'}>{foodStored}</Text>
          <div style={{ position: 'relative', width: '100%', height: '24px', padding: '4px' }}>
            <Progress
              type={'line'}
              percent={growing ? (timePassed / time) * 100 : 0}
              format={() => ''}
              strokeColor={'gray'}
              showInfo={false}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
              strokeWidth={15}
            />
            <Progress
              type={'line'}
              percent={(foodStored / foodToGrow) * 100}
              format={() => ''}
              strokeColor={'green'}
              showInfo={false}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            />
          </div>
          <Text type={'secondary'}>{foodToGrow}</Text>
        </div>
      </div>
    </div>
  );
}

export interface PlanetPopulationProps {
  planet: Planet;
  planetData: PlanetData;
}
