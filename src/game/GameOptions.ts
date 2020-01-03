import { Dispatch } from 'redux';
import { store } from '../store';
import { gameSpeedSet, setShowDebugLines, setFollowSelected, setShowDebugOrbits } from './state/state';
import { getGameSpeed, getShowDebugLines, useGetFollowSelected, useShowDebugOrbits } from './state/selectors';

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
}
