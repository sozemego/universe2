import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  objectToSpawn: ObjectToSpawn;
  serviceStatsMap: ServiceStatsMap;
}

export enum TypeOfObjectToSpawn {
  STAR = 'Star',
  PLANET = 'Planet',
}

export interface ObjectToSpawn {
  type: TypeOfObjectToSpawn;
  mass: number;
  radius: number;
  velocity: {
    x: number;
    y: number;
  };
}

export type ServiceStatsMap = Record<string, ServiceStats>;

export interface ServiceStats {
  name: string;
  min: number;
  max: number;
  average: number;
  current: number;
  previous: number[];
}

function getDefaultObjectToSpawn(): ObjectToSpawn {
  return {
    type: TypeOfObjectToSpawn.STAR,
    mass: 50,
    radius: 128,
    velocity: { x: 0, y: 0 },
  };
}

let initialState: UiState = {
  objectToSpawn: getDefaultObjectToSpawn(),
  serviceStatsMap: {},
};

export const uiSlice = createSlice<UiState, any>({
  name: 'ui',
  initialState,
  reducers: {
    setObjectToSpawn: (state: UiState, action: PayloadAction<ObjectToSpawn>) => {
      state.objectToSpawn = action.payload;
    },
    setServiceStatsMap: (state: UiState, action: PayloadAction<ServiceStatsMap>) => {
      state.serviceStatsMap = action.payload;
    },
  },
});

export const { setObjectToSpawn, setServiceStatsMap } = uiSlice.actions;
