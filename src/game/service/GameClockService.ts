import { IGameService } from './index';
import { Dispatch } from 'redux';
import { setTime } from '../state/state';
import { GameService } from '../GameService';

export class GameClockService implements IGameService {
  private readonly dispatch: Dispatch;
  private secondTimer: number = 0;
  private minuteTimer: number = 0;
  private time = 0;

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  update(delta: number) {
    this.secondTimer++;
    this.minuteTimer++;
    if (this.secondPassed) {
      this.time += 1;
      // @ts-ignore
      this.dispatch(setTime(this.time));
    }
  }

  get secondPassed() {
    return this.secondTimer % GameService.FRAMES_PER_SECOND === 0;
  }

  get minutePassed() {
    return this.minuteTimer % GameService.FRAMES_PER_MINUTE === 0;
  }
}
