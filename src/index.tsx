import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { FLAGS } from './flags';
import { runScenario } from './scenarios/futureGravity';

if (FLAGS.GRAVITY_TEST_1) {
  runScenario();
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
