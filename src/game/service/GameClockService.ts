import { IGameService } from './index';
import { Dispatch } from 'redux';
import { setTime } from '../state/state';
import { CONSTANTS } from '../Constants';

export class GameClockService implements IGameService {
  private readonly dispatch: Dispatch;
  private timer: number = 0;
  private time = 0;

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  update(delta: number) {
    this.timer++;
    if (this.secondPassed) {
      this.time += 1;
      // @ts-ignore
      this.dispatch(setTime(this.time));
    }
  }

  get secondPassed() {
    return this.timer % CONSTANTS.FRAMES_PER_SECOND === 0;
  }

  get minutePassed() {
    return this.timer % CONSTANTS.FRAMES_PER_MINUTE === 0;
  }
}
