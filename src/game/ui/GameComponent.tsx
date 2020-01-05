import React from 'react';
import { GameEngine } from '../GameEngine';
import { createInputHandler } from '../InputHandler';
import { GameUI } from './GameUI';
import { useDispatch } from 'react-redux';
import { GameCamera } from '../GameCamera';
import { GameService } from '../GameService';
import { Scene } from 'three';
import { ObjectFactory } from '../ObjectFactory';
import { Universe } from '../Universe';
import { GameObjectFactory } from '../GameObjectFactory';
import { UniverseGenerator } from '../UniverseGenerator';
import { ObjectList } from '../ObjectList';
import { GameOptions } from '../GameOptions';
import { GravityService } from '../service/GravityService';
import { AccelerationService } from '../service/AccelerationService';
import { DebugLineService } from '../service/DebugLineService';
import { MouseSelectionService } from '../service/MouseSelectionService';
import { SelectionCycleService } from '../service/SelectionCycleService';
import { MoveToSelectionService } from '../service/MoveToSelectionService';
import { CameraFollowService } from '../service/CameraFollowService';
import { CollisionService } from '../service/CollisionService';
import { SelectionRectangleService } from '../service/SelectionRectangleService';
import { DebugOrbitService } from '../service/DebugOrbitService';
import { SelectionContainer } from '../SelectionContainer';
import { SelectionService } from '../service/SelectionService';
import { GameServices, setServices } from '../state/state';
import { MainThreadGravityService } from '../service/MainThreadGravityService';
import { FLAGS } from '../../flags';

export function GameComponent() {
  const dispatch = useDispatch();
  const [started, setStarted] = React.useState(false);

  React.useLayoutEffect(() => {
    const container = document.getElementById('game-container');
    if (!container) {
      throw new Error('element with id game-container has to exist');
    }
    const input = createInputHandler(container);
    const camera = new GameCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      Universe.MAX_CAMERA_Z
    );
    const objectList = new ObjectList();
    const scene = new Scene();
    const objectFactory = new ObjectFactory(scene);
    const gameObjectFactory = new GameObjectFactory(objectList, objectFactory);
    const engine = new GameEngine(container, scene, input, camera);
    const universe = new UniverseGenerator(gameObjectFactory).generateUniverse();
    const gameOptions = new GameOptions(dispatch);

    const selectionContainer = new SelectionContainer(dispatch);
    const selectionService = new SelectionService(selectionContainer, objectList);

    const gravityService = FLAGS.GRAVITY_MAIN_THREAD
      ? new MainThreadGravityService(universe)
      : new GravityService(universe);
    const accelerationService = new AccelerationService(objectList);
    const debugLineService = new DebugLineService(objectList, objectFactory, input, gameOptions);
    const mouseSelectionService = new MouseSelectionService(
      selectionContainer,
      input,
      objectList,
      camera
    );
    const selectionCycleService = new SelectionCycleService(
      universe,
      selectionContainer,
      input,
      objectList
    );
    const moveToSelectionService = new MoveToSelectionService(
      selectionContainer,
      objectList,
      camera,
      input
    );
    const cameraFollowService = new CameraFollowService(
      objectList,
      selectionContainer,
      camera,
      input,
      gameOptions
    );
    const collisionService = new CollisionService(universe, selectionContainer);
    const selectionRectangleService = new SelectionRectangleService(
      selectionService,
      objectFactory
    );
    const debugOrbitService = new DebugOrbitService(universe, objectFactory, input, gameOptions);

    const gameServices: GameServices = {
      gravityService,
      accelerationService,
      debugLineService,
      mouseSelectionService,
      cameraFollowService,
      collisionService,
      selectionCycleService,
      selectionRectangleService,
      debugOrbitService,
      objectList,
      selectionService,
      moveToSelectionService,
      universe,
      gameOptions,
    };

    // @ts-ignore
    dispatch(setServices(gameServices));

    const services = [
      gravityService,
      accelerationService,
      debugLineService,
      mouseSelectionService,
      selectionCycleService,
      moveToSelectionService,
      cameraFollowService,
      collisionService,
      selectionRectangleService,
      debugOrbitService,
    ];

    const game = new GameService(
      engine,
      input,
      objectList,
      selectionService,
      universe,
      gameOptions,
      services
    );
    game.start();

    setStarted(true);
  }, [dispatch]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0 }} id={'game-container'} />
      {started && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}>
          <GameUI />
        </div>
      )}
    </div>
  );
}
