import React from 'react';
import { Checkbox, Icon, Slider } from 'antd';
import {
  useGetFollowSelected,
  useGetGameOptions,
  useGetGameSpeedScale,
  useGetMoveToSelectionService,
  useGetObjectBoundsService,
  useGetSelectionCycleService,
  useGetShowDebugLines,
  useShowDebugOrbits,
  useShowDebugSphereBounds,
} from '../state/selectors';

export function GameOptionsComponent() {
  const gameSpeedScale = useGetGameSpeedScale();
  const showDebugLines = useGetShowDebugLines();
  const showDebugOrbits = useShowDebugOrbits();
  const showDebugSphereBounds = useShowDebugSphereBounds();
  const followSelected = useGetFollowSelected();
  const gameOptions = useGetGameOptions();
  const moveToSelectionService = useGetMoveToSelectionService();
  const selectionCycleService = useGetSelectionCycleService();
  const objectBoundsService = useGetObjectBoundsService();

  return (
    <div style={{ width: '100%', padding: '4px' }}>
      <div>Options</div>
      <div>
        <div>Game speed scale [{gameSpeedScale}]</div>
        <Slider
          value={gameSpeedScale * 100}
          onChange={val => (gameOptions.gameSpeedScale = (val as number) / 100)}
          max={500}
        />
      </div>
      <div onClick={() => (gameOptions.showDebugLines = !gameOptions.showDebugLines)}>
        <Checkbox
          checked={showDebugLines}
          onChange={() => (gameOptions.showDebugLines = !gameOptions.showDebugLines)}
        />
        <span>Show debug lines</span>
      </div>
      <div onClick={() => (gameOptions.showDebugOrbits = !gameOptions.showDebugOrbits)}>
        <Checkbox
          checked={showDebugOrbits}
          onChange={() => (gameOptions.showDebugOrbits = !gameOptions.showDebugOrbits)}
        />
        <span>Show debug orbits</span>
      </div>
      <div
        onClick={() =>
          objectBoundsService.setVisibilityOfSphereBounds(!gameOptions.showDebugSphereBounds)
        }
      >
        <Checkbox
          checked={showDebugSphereBounds}
          onChange={() =>
            objectBoundsService.setVisibilityOfSphereBounds(!gameOptions.showDebugSphereBounds)
          }
        />
        <span>Show debug sphere bounds</span>
      </div>
      <div onClick={() => (gameOptions.followSelected = !gameOptions.followSelected)}>
        <Checkbox
          checked={followSelected}
          onChange={() => (gameOptions.followSelected = !gameOptions.followSelected)}
        />
        <span>Follow selected</span>
      </div>
      <div style={{ cursor: 'pointer' }}>
        <Icon
          type="step-backward"
          onClick={() => {
            selectionCycleService.cycleStars(-1);
            moveToSelectionService.showSelection(true);
          }}
        />
        <Icon
          type="fast-backward"
          onClick={() => {
            selectionCycleService.cyclePlanets(-1);
            moveToSelectionService.showSelection(true);
          }}
        />
        <Icon type="shrink" onClick={() => moveToSelectionService.showSelection(false)} />
        <Icon
          type="vertical-align-middle"
          onClick={() => moveToSelectionService.showSelection(true)}
        />
        <Icon
          type="fast-forward"
          onClick={() => {
            selectionCycleService.cyclePlanets(1);
            moveToSelectionService.showSelection(true);
          }}
        />
        <Icon
          type="step-forward"
          onClick={() => {
            selectionCycleService.cycleStars(1);
            moveToSelectionService.showSelection(true);
          }}
        />
      </div>
    </div>
  );
}

export interface GameOptionsComponentProps {}
