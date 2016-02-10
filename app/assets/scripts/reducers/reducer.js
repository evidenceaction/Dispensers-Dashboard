import _ from 'lodash';
import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import * as actions from '../actions/action-types';

export default combineReducers({
  routing: routeReducer
});
