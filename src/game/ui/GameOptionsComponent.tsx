import React from 'react';
import { Checkbox, Icon, Slider } from 'antd';
import {
  useGetFollowSelected,
  useGetGameOptions,
  useGetGameSpeed,
  useGetMoveToSelectionService,
  useGetObjectBoundsService,
  useGetSelectionCycleService,
  useGetShowDebugLines,
  useShowDebugOrbits,
  useShowDebugSphereBounds,
} from '../state/selectors';

export function GameOptionsComponent() {
  const gameSpeed = useGetGameSpeed();
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
        <div>Game speed [{gameSpeed}]</div>
        <Slider
          value={gameSpeed}
          onChange={val => (gameOptions.gameSpeed = val as number)}
          max={25}
        />
      </div>
      <div>
        <Checkbox
          checked={showDebugLines}
          onChange={() => (gameOptions.showDebugLines = !gameOptions.showDebugLines)}
        />
        <span onClick={() => (gameOptions.showDebugLines = !gameOptions.showDebugLines)}>
          Show debug lines
        </span>
      </div>
      <div>
        <Checkbox
          checked={showDebugOrbits}
          onChange={() => (gameOptions.showDebugOrbits = !gameOptions.showDebugOrbits)}
        />
        <span onClick={() => (gameOptions.showDebugOrbits = !gameOptions.showDebugOrbits)}>
          Show debug orbits
        </span>
      </div>
      <div>
        <Checkbox
          checked={showDebugSphereBounds}
          onChange={() =>
            objectBoundsService.setVisibilityOfSphereBounds(!gameOptions.showDebugSphereBounds)
          }
        />
        <span
          onClick={() =>
            objectBoundsService.setVisibilityOfSphereBounds(!gameOptions.showDebugSphereBounds)
          }
        >
          Show debug sphere bounds
        </span>
      </div>
      <div>
        <Checkbox
          checked={followSelected}
          onChange={() => (gameOptions.followSelected = !gameOptions.followSelected)}
        />
        <span onClick={() => (gameOptions.followSelected = !gameOptions.followSelected)}>
          Follow selected
        </span>
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
