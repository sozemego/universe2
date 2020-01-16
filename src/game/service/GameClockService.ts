import { IGameService } from './index';
import { Dispatch } from 'redux';
import { setTime } from '../state/state';

export class GameClockService implements IGameService {
  private readonly dispatch: Dispatch;
  private readonly updateTime: number = 1;
  private timer: number = 0;
  private time = 0;

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  update(delta: number) {
    this.timer += delta;
    if (this.timer >= this.updateTime) {
      this.timer -= this.updateTime;
      this.time += 1;
      // @ts-ignore
      this.dispatch(setTime(this.time));
    }
  }
}
