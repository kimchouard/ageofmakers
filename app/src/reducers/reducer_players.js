/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { SET_NEW_PLAYER, GET_PLAYERS, REMOVE_PLAYER, SET_PLAYER_ONBOARDING, SET_PLAYER_SDG, SET_PLAYER_JOURNEY, AGE_CHANGE, RESET_PLAYER_JOURNEY } from '../actions/index';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_NEW_PLAYER:
      return action.payload;
    case GET_PLAYERS:
      return action.payload;
    case SET_PLAYER_ONBOARDING:
      return action.payload;
    case SET_PLAYER_SDG:
      return action.payload;
    case SET_PLAYER_JOURNEY:
      return action.payload;
    case RESET_PLAYER_JOURNEY:
      return action.payload;
    case REMOVE_PLAYER:
      return action.payload;
    case AGE_CHANGE:
      return action.payload;
    default:
      return state;
  }
};
