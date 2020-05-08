/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { SET_NEW_PLAYER, GET_PLAYERS, REMOVE_PLAYER, SET_PLAYER_SDG } from '../actions/index';

export default (state = null, action) => {
  switch (action.type) {
    case SET_NEW_PLAYER:
      return action.payload;
    case GET_PLAYERS:
      return action.payload;
    case SET_PLAYER_SDG:
      return action.payload;
    case REMOVE_PLAYER:
      return action.payload;
    default:
      return state;
  }
};
