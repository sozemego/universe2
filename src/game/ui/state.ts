import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  objectToSpawn: ObjectToSpawn;
}

export enum TypeOfObjectToSpawn {
  STAR = 'Star',
  PLANET = 'Planet',
}

export interface ObjectToSpawn {
  type: TypeOfObjectToSpawn;
  mass: number;
  radius: number;
}

function getDefaultObjectToSpawn(): ObjectToSpawn {
  return {
    type: TypeOfObjectToSpawn.STAR,
    mass: 50,
    radius: 128,
  };
}

let initialState: UiState = {
  objectToSpawn: getDefaultObjectToSpawn(),
};

export const uiSlice = createSlice<UiState, any>({
  name: 'ui',
  initialState,
  reducers: {
    setObjectToSpawn: (state: UiState, action: PayloadAction<ObjectToSpawn>) => {
      state.objectToSpawn = action.payload;
    },
  },
});

export const { setObjectToSpawn } = uiSlice.actions;
