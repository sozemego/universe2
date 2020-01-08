import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { gameSlice } from './game/state/state';

const reducer = combineReducers({
  game: gameSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: [thunk],
});
