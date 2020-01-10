import { GameState } from './game/state/state';
import { UiState } from './game/ui/state';

export interface AppState {
  game: GameState;
  ui: UiState;
}
