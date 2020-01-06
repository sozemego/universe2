import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjectList } from '../ObjectList';
import { SelectionService } from '../service/SelectionService';
import { MoveToSelectionService } from '../service/MoveToSelectionService';
import { GravityService } from '../service/GravityService';
import { AccelerationService } from '../service/AccelerationService';
import { DebugLineService } from '../service/DebugLineService';
import { MouseSelectionService } from '../service/MouseSelectionService';
import { CameraFollowService } from '../service/CameraFollowService';
import { CollisionService } from '../service/CollisionService';
import { SelectionCycleService } from '../service/SelectionCycleService';
import { SelectionRectangleService } from '../service/SelectionRectangleService';
import { DebugOrbitService } from '../service/DebugOrbitService';
import { Universe } from '../universe/Universe';
import { GameOptions } from "../GameOptions";
import { MainThreadGravityService } from "../service/MainThreadGravityService";
import { ObjectBoundsService } from "../service/ObjectBoundsService";

const initialState: GameState = {
  selected: null,
  mouseOver: null,
  gameSpeed: 1,
  gameSpeedScale: 1,
  showDebugLines: false,
  followSelected: false,
  showDebugOrbits: false,
  showDebugSphereBounds: false,
  services: null,
};

export const gameSlice = createSlice<GameState, any>({
  name: 'game',
  initialState,
  reducers: {
    mousedOver: (state: GameState, action: PayloadAction<string>) => {
      state.mouseOver = action.payload;
    },
    selected: (state: GameState, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
    gameSpeedSet: (state: GameState, action: PayloadAction<number>) => {
      state.gameSpeed = action.payload;
    },
    setShowDebugLines: (state: GameState, action: PayloadAction<boolean>) => {
      state.showDebugLines = action.payload;
    },
    setFollowSelected: (state: GameState, action: PayloadAction<boolean>) => {
      state.followSelected = action.payload;
    },
    setShowDebugOrbits: (state: GameState, action: PayloadAction<boolean>) => {
      state.showDebugOrbits = action.payload;
    },
    setGameSpeedScale: (state: GameState, action: PayloadAction<number>) => {
      state.gameSpeedScale = action.payload;
    },
    setShowDebugSphereBounds: (state: GameState, action: PayloadAction<boolean>) => {
      state.showDebugSphereBounds = action.payload;
    },
    setServices: (state: GameState, action: PayloadAction<GameServices>) => {
      state.services = action.payload;
    },
  },
});

export const {
  mousedOver,
  selected,
  gameSpeedSet,
  setShowDebugLines,
  setFollowSelected,
  setShowDebugOrbits,
  setServices,
  setGameSpeedScale,
  setShowDebugSphereBounds
} = gameSlice.actions;

export interface GameServices {
  gravityService: GravityService | MainThreadGravityService;
  accelerationService: AccelerationService;
  debugLineService: DebugLineService;
  mouseSelectionService: MouseSelectionService;
  cameraFollowService: CameraFollowService;
  collisionService: CollisionService;
  selectionCycleService: SelectionCycleService;
  selectionRectangleService: SelectionRectangleService;
  debugOrbitService: DebugOrbitService;
  objectList: ObjectList;
  selectionService: SelectionService;
  moveToSelectionService: MoveToSelectionService;
  objectBoundsService: ObjectBoundsService;
  universe: Universe;
  gameOptions: GameOptions;
}

export interface GameState {
  selected: string | null;
  mouseOver: string | null;
  gameSpeed: number;
  gameSpeedScale: number;
  showDebugLines: boolean;
  followSelected: boolean;
  showDebugOrbits: boolean;
  showDebugSphereBounds: boolean;
  services: GameServices | null;
}
