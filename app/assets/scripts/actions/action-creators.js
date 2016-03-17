import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// //////////////////////////////////////////////////////////////////////////
// // Fetch Section Thunk

function requestSection (section) {
  return {
    type: actions[`REQUEST_SECTION_${section.toUpperCase()}`]
  };
}

function receiveSection (section, json) {
  return {
    type: actions[`RECEIVE_SECTION_${section.toUpperCase()}`],
    data: json,
    receivedAt: Date.now()
  };
}

export function fetchSection (section) {
  return dispatch => {
    dispatch(requestSection(section));

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    return fetch(`${config.api}/kpi/${section}`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveSection(section, json));
      })
      .catch(err => {
        throw err;
      });
  };
}
