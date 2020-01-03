import { Object3D, Raycaster, Vector3 } from 'three';
import { SelectionContainer } from '../SelectionContainer';
import { InputHandler, Mouse } from '../InputHandler';
import { GameCamera } from '../GameCamera';
import { IGameService } from './index';
import { ObjectList } from '../ObjectList';
import { BaseObject } from '../object/BaseObject';
import { Star } from '../object/Star';
import { Planet } from '../object/Planet';

export class MouseSelectionService implements IGameService {
  private readonly selectionContainer: SelectionContainer;
  private readonly input: InputHandler;
  private readonly objectList: ObjectList;
  private readonly camera: GameCamera;
  private mouse: Mouse;

  constructor(
    selectionContainer: SelectionContainer,
    input: InputHandler,
    objectList: ObjectList,
    camera: GameCamera
  ) {
    this.selectionContainer = selectionContainer;
    this.input = input;
    this.objectList = objectList;
    this.camera = camera;
    this.mouse = {
      x: 0,
      y: 0,
      rawX: 0,
      rawY: 0,
      worldX: 0,
      worldY: 0,
      button: -1,
    };

    this.input.onMouseMove(mouse => {
      this.updateMouse(mouse);

      const allObjects = this.getAllObjects();
      const objects = this.findObjectsUnderMouse(allObjects);
      const mouseOver = this.selectionContainer.mouseOver;
      const nextMouseOver = objects[0];
      if (mouseOver && !nextMouseOver) {
        this.selectionContainer.mouseOver = null;
      }
      if (!mouseOver && nextMouseOver) {
        this.selectionContainer.mouseOver = nextMouseOver.object.userData.objectId;
      }
    });
    this.input.onMouseUp(mouse => {
      this.updateMouse(mouse);
      const allObjects = this.getAllObjects();
      const objects = this.findObjectsUnderMouse(allObjects);
      const selected = this.selectionContainer.selected;
      const nextSelected = objects[0];
      if (selected && !nextSelected) {
        this.selectionContainer.selected = null;
      }
      if (!selected && nextSelected) {
        this.selectionContainer.selected = nextSelected.object.userData.objectId;
      }
    });
  }

  update(delta: number) {}

  updateMouse(newMouse: Mouse) {
    const worldCoords = this.camera.localToWorld(new Vector3(newMouse.rawX, newMouse.rawY, 0));
    this.mouse = {
      ...this.mouse,
      ...newMouse,
      worldX: worldCoords.x,
      worldY: worldCoords.y,
    };
  }

  findObjectsUnderMouse(objects: Object3D[]) {
    const rayCaster = new Raycaster();
    this.camera.updateMatrixWorld(true);
    rayCaster.setFromCamera(this.mouse, this.camera);
    return rayCaster.intersectObjects(objects);
  }

  getAllObjects(): Object3D[] {
    let allObjects: Object3D[] = [];
    this.objectList.allObjects
      .filter(obj => obj instanceof BaseObject)
      .forEach(obj => {
        if (obj instanceof Star || obj instanceof Planet) {
          allObjects.push(obj.object3D);
        }
      });
    return allObjects;
  }
}
