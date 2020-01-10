import { SelectionContainer } from '../SelectionContainer';
import { GameCamera } from '../GameCamera';
import { InputHandler, KEY, KeyEvent } from '../InputHandler';
import { ObjectList } from '../ObjectList';
import { Vector2, Vector3 } from 'three';
import { IGameService } from './index';

export class MoveToSelectionService implements IGameService {
  private selectionContainer: SelectionContainer;
  private objectList: ObjectList;
  private camera: GameCamera;
  private input: InputHandler;

  constructor(
    selectionContainer: SelectionContainer,
    objectList: ObjectList,
    camera: GameCamera,
    input: InputHandler
  ) {
    this.selectionContainer = selectionContainer;
    this.objectList = objectList;
    this.camera = camera;
    this.input = input;
    this.input.onKeyUp(this.onKeyUp);
  }

  update(delta: number) {}

  onKeyUp = (event: KeyEvent) => {
    if (event.key !== KEY.o && event.key !== KEY.O) {
      return;
    }
    const zoom = event.key === KEY.O;
    this.showSelection(zoom);
  };

  showSelection = (zoom: boolean) => {
    const selected = this.objectList.findById(this.selectionContainer.selected);
    if (selected) {
      this.moveTo(selected.position, zoom);
    }
  };

  moveTo(position: Vector2 | Vector3, zoom: boolean) {
    this.camera.moveTo(new Vector2(position.x, position.y));
    if (zoom) {
      this.camera.position.z = 5000;
    }
  }
}
