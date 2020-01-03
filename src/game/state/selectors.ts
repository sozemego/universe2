import { useSelector } from 'react-redux';
import { AppState } from '../../state';

export function useGetMouseOver() {
  return useSelector((state: AppState) => state.game.mouseOver);
}

export function useGetSelected() {
  return useSelector((state: AppState) => state.game.selected);
}

export function useGetGameSpeed() {
  return useSelector((state: AppState) => state.game.gameSpeed);
}

export function getGameSpeed(state: AppState) {
  return state.game.gameSpeed;
}

export function useGetShowDebugLines() {
  return useSelector((state: AppState) => state.game.showDebugLines);
}

export function getShowDebugLines(state: AppState) {
  return state.game.showDebugLines;
}

export function useGetFollowSelected(state?: AppState) {
  if (state) {
    return state.game.followSelected;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector((state: AppState) => state.game.followSelected);
}

export function useShowDebugOrbits(state?: AppState) {
  if (state) {
    return state.game.showDebugOrbits;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector((state: AppState) => state.game.showDebugOrbits);
}

export function useGetObjectList() {
  return useSelector((state: AppState) => state.game.services!.objectList);
}

export function useGetSelectionService() {
  return useSelector((state: AppState) => state.game.services!.selectionService);
}

export function useGetGameOptions() {
  return useSelector((state: AppState) => state.game.services!.gameOptions);
}

export function useGetMoveToSelectionService() {
  return useSelector((state: AppState) => state.game.services!.moveToSelectionService);
}

export function useGetSelectionCycleService() {
  return useSelector((state: AppState) => state.game.services!.selectionCycleService);
}