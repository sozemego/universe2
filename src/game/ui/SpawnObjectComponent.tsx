import React from 'react';
import { useGetSpawnObjectService } from '../state/selectors';
import { Divider, InputNumber, Select } from 'antd';
import { useGetObjectToSpawn } from './selectors';
import { TypeOfObjectToSpawn } from './state';
const { Option } = Select;

export function SpawnObjectComponent() {
  let spawnObjectService = useGetSpawnObjectService();
  let objectToSpawn = useGetObjectToSpawn();

  return (
    <div>
      <Divider />
      <div>Object spawner</div>
      <div style={{ width: '100%' }}>
        <span>Type:</span>
        <Select
          defaultValue={TypeOfObjectToSpawn.STAR}
          value={objectToSpawn.type}
          style={{ width: '150px' }}
          onChange={(value: TypeOfObjectToSpawn) => {
            objectToSpawn.type = value;
            spawnObjectService.objectToSpawn = objectToSpawn;
          }}
        >
          <Option value={TypeOfObjectToSpawn.STAR}>{TypeOfObjectToSpawn.STAR}</Option>
          <Option value={TypeOfObjectToSpawn.PLANET}>{TypeOfObjectToSpawn.PLANET}</Option>
        </Select>
      </div>
      <div>
        <span>Mass</span>
        <InputNumber
          min={0.005}
          max={50000}
          value={objectToSpawn.mass}
          onChange={value => {
            objectToSpawn.mass = value as number;
            spawnObjectService.objectToSpawn = objectToSpawn;
          }}
        />
      </div>
      <div>
        <span>Radius</span>
        <InputNumber
          min={1}
          max={5000}
          value={objectToSpawn.radius}
          onChange={value => {
            objectToSpawn.radius = value as number;
            spawnObjectService.objectToSpawn = objectToSpawn;
          }}
        />
      </div>
      <div>
        <div>Velocity:</div>
        <span>x: </span>
        <InputNumber
          min={-30000}
          max={30000}
          value={objectToSpawn.velocity.x}
          onChange={value => {
            objectToSpawn.velocity.x = value as number;
            spawnObjectService.objectToSpawn = objectToSpawn;
          }}
        />
        <span>y: </span>
        <InputNumber
          min={-30000}
          max={30000}
          value={objectToSpawn.velocity.y}
          onChange={value => {
            objectToSpawn.velocity.y = value as number;
            spawnObjectService.objectToSpawn = objectToSpawn;
          }}
        />
      </div>
    </div>
  );
}
