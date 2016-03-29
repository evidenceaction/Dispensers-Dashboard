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

export function fetchSection (section, country = null) {
  return dispatch => {
    dispatch(requestSection(section));

    let url = `${config.api}/kpi/${section}`;

    if (country !== null) {
      url = `${url}/${country}`;
    }
    return fetch(url)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        dispatch(receiveSection(section, json));
      }, e => {
        throw e;
      });
  };
}
