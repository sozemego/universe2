import { Scene, TextureLoader, WebGLRenderer } from 'three/src/Three';
// @ts-ignore
import Stats from 'stats-js';
import { GameService } from './GameService';
import { InputHandler, KEY } from './InputHandler';
import { GameCamera } from './GameCamera';

export class GameEngine {
  private readonly inputHandler: InputHandler;
  private readonly camera: GameCamera;
  private updateFn: (delta: number) => void;
  private readonly scene: Scene;
  private readonly renderer: WebGLRenderer;
  private readonly stats: Stats;
  // private readonly cameraHelper: CameraHelper;
  // private readonly axesHelper: AxesHelper;
  private readonly pressedKeys: Set<string>;
  private readonly textureLoader: TextureLoader;

  constructor(
    container: HTMLElement,
    scene: Scene,
    inputHandler: InputHandler,
    camera: GameCamera
  ) {
    this.inputHandler = inputHandler;
    this.camera = camera;
    this.updateFn = () => {};

    this.scene = scene;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth - 17, window.innerHeight);

    window.addEventListener('resize', this._resize);

    this.stats = new Stats();
    this.stats.showPanel(0);

    if (container) {
      container.append(this.renderer.domElement);
      container.appendChild(this.stats.dom);
    } else {
      throw new Error('Game container does not exist');
    }

    // this.cameraHelper = new CameraHelper(this.camera);
    // this.scene.add(this.cameraHelper);

    // this.axesHelper = new AxesHelper(5);
    // this.scene.add(this.axesHelper);

    this.camera.position.x = 5000000 / 2;
    this.camera.position.y = 5000000 / 2;
    this.camera.position.z = 5000000;

    this.pressedKeys = new Set();

    inputHandler.onKeyDown(event => {
      // console.log(`Key down    ${JSON.stringify(event)}`);
      this.pressedKeys.add(event.key);
      return false;
    });

    inputHandler.onKeyUp(event => {
      // console.log(`Key up      ${JSON.stringify(event)}`);
      this.pressedKeys.delete(event.key);
      return false;
    });

    this.textureLoader = new TextureLoader();
  }

  _resize = () => {
    this.renderer.setSize(window.innerWidth - 17, window.innerHeight);
    this.camera.aspect = (window.innerWidth - 17) / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  start = () => {
    this._animate();
  };

  _animate = () => {
    this.stats.begin();

    this.handleCameraMovement();

    this.camera.updateProjectionMatrix();
    // this.cameraHelper.update();

    this.updateFn(GameService.FPS);

    this.renderer.render(this.scene, this.camera);

    this.stats.end();

    requestAnimationFrame(this._animate);
  };

  handleCameraMovement() {
    const scale = 100000 * (this.camera.position.z / 5000000);
    if (this.pressedKeys.has(KEY.a)) {
      this.camera.position.x -= 0.5 * scale;
    }
    if (this.pressedKeys.has(KEY.d)) {
      this.camera.position.x += 0.5 * scale;
    }
    if (this.pressedKeys.has(KEY.s)) {
      this.camera.position.y -= 0.5 * scale;
    }
    if (this.pressedKeys.has(KEY.w)) {
      this.camera.position.y += 0.5 * scale;
    }
    if (this.pressedKeys.has(KEY.q)) {
      this.camera.position.z += 0.5 * scale;
    }
    if (this.pressedKeys.has(KEY.e)) {
      this.camera.position.z -= 0.5 * scale;
    }
  }

  setUpdate(fn: (delta: number) => void) {
    this.updateFn = fn;
  }
}
