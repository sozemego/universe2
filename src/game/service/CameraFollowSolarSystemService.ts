import { IGameService } from './index';
import { GameCamera } from '../GameCamera';
import { Universe } from '../universe/Universe';
import { SolarSystem } from '../object/SolarSystem';
import { Vector2, Vector3 } from 'three';

export class CameraFollowSolarSystemService implements IGameService {
  private readonly camera: GameCamera;
  private readonly universe: Universe;
  private solarSystem: SolarSystem | null;
  private positions: Vector3[] = [];

  constructor(camera: GameCamera, universe: Universe) {
    this.camera = camera;
    this.universe = universe;
    this.solarSystem = null;
  }

  update(delta: number) {
    //1. determine if we are over a solar system
    let solarSystem = this.getSolarSystemInCamera();
    if (this.solarSystem !== solarSystem) {
      this.solarSystem = solarSystem;
      this.positions = [];
      if (solarSystem !== null) {
        this.positions[0] = solarSystem.position;
        return;
      }
    }
    //2. take current and last position of the central star
    if (this.positions.length === 1 && this.solarSystem) {
      this.positions[1] = this.solarSystem.position.clone();
    }
    if (this.positions.length === 2 && this.solarSystem) {
      this.positions[0] = this.positions[1];
      this.positions[1] = this.solarSystem.position.clone();
      //3. move the camera by the difference of those two positions
      let difference = this.positions[1].clone().sub(this.positions[0]);
      this.camera.position.x += difference.x;
      this.camera.position.y += difference.y;
    }
  }

  getSolarSystemInCamera(): SolarSystem | null {
    let { solarSystems } = this.universe;
    for (let solarSystem of solarSystems) {
      let cameraFlatPosition = new Vector3(this.camera.position.x, this.camera.position.y, 0);
      if (solarSystem.sphere.containsPoint(cameraFlatPosition)) {
        return solarSystem;
      }
    }
    return null;
  }
}
