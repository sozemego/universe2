import { Scene, TextureLoader, WebGLRenderer } from 'three/src/Three';
// @ts-ignore
import Stats from 'stats-js';
import { InputHandler, KEY } from './InputHandler';
import { GameCamera } from './GameCamera';
import { Universe } from './universe/Universe';
import { GameService } from './GameService';

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

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth - 5, window.innerHeight - 5);

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
    this.camera.zoomInDirection(1);
    this.camera.zoomInDirection(1);
    this.camera.zoomInDirection(1);
    this.camera.zoomInDirection(1);
    this.camera.zoomInDirection(1);
    this.camera.zoomInDirection(1);

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

    inputHandler.onKeyUp(event => this.handleZoom(event.key));

    this.textureLoader = new TextureLoader();
  }

  _resize = () => {
    this.renderer.setSize(window.innerWidth - 5, window.innerHeight - 5);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  start = (): Promise<void> => {
    return this.loadAllTextures().then(() => {
      this._animate();
    });
  };

  _animate = () => {
    this.stats.begin();

    this.handleCameraMovement();

    this.camera.update(GameService.FPS);
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
  }

  handleZoom(key: KEY) {
    if (key === KEY.q) {
      this.camera.zoomInDirection(-1);
    }
    if (key === KEY.e) {
      this.camera.zoomInDirection(1);
    }
  }

  setUpdate(fn: (delta: number) => void) {
    this.updateFn = fn;
  }

  loadAllTextures(): Promise<unknown[]> {
    let textures = [
      'textures/black_hole_1.png',
      'textures/green_planet_1.png',
      'textures/white_star_1.png',
    ];
    let promises = textures.map(
      texture => new Promise(resolve => this.textureLoader.load(texture, resolve))
    );
    return Promise.all(promises);
  }
}
