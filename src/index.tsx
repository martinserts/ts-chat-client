import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { State } from './state/state';

const localEnv = process.env.REACT_APP_LOCAL_ENV;
const ws = localEnv ? 'ws://localhost:8822' : `wss://${window.location.host}/api/`;
const reconnectTimeout = 5000;
const state = new State(ws, reconnectTimeout);

ReactDOM.render(
  <React.StrictMode>
    <App state={state} />
  </React.StrictMode>,
  document.getElementById('root'),
);
