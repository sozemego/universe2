import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { gameSlice } from './game/state/state';
import { uiSlice } from './game/ui/state';

const reducer = combineReducers({
  game: gameSlice.reducer,
  ui: uiSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: [thunk],
});
