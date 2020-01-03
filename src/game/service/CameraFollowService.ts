import { ObjectList } from '../ObjectList';
import { SelectionContainer } from '../SelectionContainer';
import { GameCamera } from '../GameCamera';
import { InputHandler, KEY, KeyEvent } from '../InputHandler';
import { Vector2 } from 'three';
import { GameOptions } from '../GameOptions';
import { IGameService } from './index';

export class CameraFollowService implements IGameService {
  private objectList: ObjectList;
  private selectionContainer: SelectionContainer;
  private camera: GameCamera;
  private input: InputHandler;
  private options: GameOptions;

  constructor(
    objectList: ObjectList,
    selectionContainer: SelectionContainer,
    camera: GameCamera,
    input: InputHandler,
    options: GameOptions
  ) {
    this.objectList = objectList;
    this.selectionContainer = selectionContainer;
    this.camera = camera;
    this.input = input;
    this.options = options;
    this.input.onKeyUp(this.follow);
    this.input.onKeyUp(this.unfollow);
  }

  update(delta: number) {
    const isObjectSelected = !!this.selectionContainer.selected;
    if (this.options.followSelected && isObjectSelected) {
      const selected = this.objectList.findById(this.selectionContainer.selected);
      this.camera.moveTo(new Vector2(selected!.position.x, selected!.position.y));
    }
    if (this.options.followSelected && !isObjectSelected) {
      this.options.followSelected = false;
    }
  }

  follow = (event: KeyEvent) => {
    if (event.key !== KEY.i) {
      return;
    }

    const selected = this.objectList.findById(this.selectionContainer.selected);
    if (this.options.followSelected) {
      this.options.followSelected = false;
    } else if (selected) {
      this.options.followSelected = true;
    }
  };

  unfollow = (event: KeyEvent) => {
    if (event.key !== KEY.ESC) {
      return;
    }
    this.options.followSelected = false;
  };
}
