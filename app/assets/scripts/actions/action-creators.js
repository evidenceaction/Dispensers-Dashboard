import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// //////////////////////////////////////////////////////////////////////////
// // Fetch Datasets Thunk

function requestSectionAccess () {
  return {
    type: actions.REQUEST_SECTION_ACCESS
  };
}

function receiveSectionAccess (json) {
  return {
    type: actions.RECEIVE_SECTION_ACCESS,
    data: json,
    receivedAt: Date.now()
  };
}

export function fetchSectionAccess () {
  return dispatch => {
    dispatch(requestSectionAccess());

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    return fetch(`${config.api}/kpi/access`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveSectionAccess(json));
      })
      .catch(err => {
        throw err;
      });
  };
}
