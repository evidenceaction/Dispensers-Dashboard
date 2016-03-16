import _ from 'lodash';
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import * as actions from '../actions/action-types';

const sectionAccess = function (state = {fetching: false, fetched: false, data: null}, action) {
  switch (action.type) {
    case actions.REQUEST_SECTION_ACCESS:
      console.log('REQUEST_SECTION_ACCESS');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_SECTION_ACCESS:
      console.log('RECEIVE_SECTION_ACCESS');
      state = _.cloneDeep(state);
      state.data = action.data;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const sectionReliability = function (state = {fetching: false, fetched: false, data: null}, action) {
  switch (action.type) {
    case actions.REQUEST_SECTION_RELIABILITY:
      console.log('REQUEST_SECTION_RELIABILITY');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_SECTION_RELIABILITY:
      console.log('RECEIVE_SECTION_RELIABILITY');
      state = _.cloneDeep(state);
      state.data = action.data;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const sectionUsage = function (state = {fetching: false, fetched: false, data: null}, action) {
  switch (action.type) {
    case actions.REQUEST_SECTION_USAGE:
      console.log('REQUEST_SECTION_USAGE');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_SECTION_USAGE:
      console.log('RECEIVE_SECTION_USAGE');
      state = _.cloneDeep(state);
      state.data = action.data;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const sectionCarbon = function (state = {fetching: false, fetched: false, data: null}, action) {
  switch (action.type) {
    case actions.REQUEST_SECTION_CARBON:
      console.log('REQUEST_SECTION_CARBON');
      state = _.cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_SECTION_CARBON:
      console.log('RECEIVE_SECTION_CARBON');
      state = _.cloneDeep(state);
      state.data = action.data;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

export default combineReducers({
  routing: routeReducer,
  sectionAccess,
  sectionReliability,
  sectionUsage,
  sectionCarbon
});
