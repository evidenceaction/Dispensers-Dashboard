'use strict';
/* global L */
require('mapbox.js');
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistory } from 'react-router-redux';
import reducer from './reducers/reducer';
import config from './config';

L.mapbox.accessToken = config.mbToken;

import UhOh from './views/uhoh';
import App from './views/app';
import Home from './views/home';
import Country from './views/country';

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(hashHistory);
const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(reduxRouterMiddleware, thunkMiddleware)
  // Required! Enable Redux DevTools with the monitors you chose.
  // DevTools.instrument()
)(createStore);

const store = finalCreateStore(reducer);

// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store);

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <Route path='404' component={UhOh} />
        <Route path=':country' component={Country} />
        <IndexRoute component={Home}/>
      </Route>
      <Route path='*' component={App}>
        <IndexRoute component={UhOh}/>
      </Route>
    </Router>
  </Provider>
), document.querySelector('#site-canvas'));
