import { Dispatch } from 'redux';
import { store } from '../store';
import { gameSpeedSet, setShowDebugLines, setFollowSelected, setShowDebugOrbits, setGameSpeedScale, setShowDebugSphereBounds } from './state/state';
import {
  getGameSpeed,
  getShowDebugLines,
  useGetFollowSelected,
  useGetGameSpeedScale,
  useShowDebugOrbits, useShowDebugSphereBounds
} from './state/selectors';
import { clampAbs } from "../mathUtils";

export class GameOptions {
  private readonly dispatch: Dispatch<any>;

  constructor(dispatch: Dispatch<any>) {
    this.dispatch = dispatch;
  }

  set gameSpeed(speed: number) {
    if (speed >= 0) {
      // @ts-ignore
      this.dispatch(gameSpeedSet(speed));
    }
  }

  get gameSpeed() {
    return getGameSpeed(store.getState());
  }

  set showDebugLines(bool: boolean) {
    // @ts-ignore
    this.dispatch(setShowDebugLines(bool));
  }

  get showDebugLines() {
    return getShowDebugLines(store.getState());
  }

  set followSelected(bool: boolean) {
    // @ts-ignore
    this.dispatch(setFollowSelected(bool));
  }

  get followSelected() {
    return useGetFollowSelected(store.getState());
  }

  set showDebugOrbits(bool: boolean) {
    // @ts-ignore
    this.dispatch(setShowDebugOrbits(bool));
  }

  get showDebugOrbits() {
    return useShowDebugOrbits(store.getState());
  }

  set gameSpeedScale(scale: number) {
    scale = clampAbs(scale, 0, 5);
    // @ts-ignore
    this.dispatch(setGameSpeedScale(scale));
  }

  get gameSpeedScale() {
    return useGetGameSpeedScale(store.getState());
  }

  set showDebugSphereBounds(bool: boolean) {
    // @ts-ignore
    this.dispatch(setShowDebugSphereBounds(bool));
  }

  get showDebugSphereBounds() {
    return useShowDebugSphereBounds(store.getState());
  }
}
