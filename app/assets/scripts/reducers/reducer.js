// import _ from 'lodash';
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
// import * as actions from '../actions/action-types';

export default combineReducers({
  routing: routeReducer
});
