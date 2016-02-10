import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////////////////
// //// Fetch Datasets Thunk

// function requestDatasets () {
//   return {
//     type: actions.REQUEST_DATASETS
//   };
// }

// function receiveDatasets (json) {
//   return {
//     type: actions.RECEIVE_DATASETS,
//     items: json.datasets,
//     receivedAt: Date.now()
//   };
// }

// export function fetchDatasets () {
//   return dispatch => {
//     dispatch(requestDatasets());

//     // The function called by the thunk middleware can return a value,
//     // that is passed on as the return value of the dispatch method.

//     // In this case, we return a promise to wait for.
//     // This is not required by thunk middleware, but it is convenient for us.
//     return fetch(`${config.api}/datasets`)
//       .then(response => response.json())
//       .then(json => {
//         dispatch(receiveDatasets(json));
//       });

//       // In a real world app, you also want to
//       // catch any error in the network call.
//   };
// }
