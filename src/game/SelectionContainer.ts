import { mousedOver, selected } from './state/state';
import { Dispatch } from 'redux';

export class SelectionContainer {
  private _mouseOver: string | null;
  private _selected: string | null;
  private dispatch: Dispatch;

  constructor(dispatch: Dispatch) {
    this._mouseOver = null;
    this._selected = null;
    this.dispatch = dispatch;
  }

  get mouseOver() {
    return this._mouseOver;
  }

  set mouseOver(id: any) {
    if (id && typeof id !== 'string') {
      id = id.id;
    }
    this._mouseOver = id;
    // @ts-ignore
    this.dispatch(mousedOver(id));
  }

  get selected() {
    return this._selected;
  }

  set selected(id: any) {
    if (id && typeof id !== 'string') {
      id = id.id;
    }
    this._selected = id;
    // @ts-ignore
    this.dispatch(selected(id));
  }
}
