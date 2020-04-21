/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LOG_IN, LOG_OUT, GET_ACTIVE_PLAYER } from '../actions/index';

export default (state = null, action) => {
  switch (action.type) {
    case LOG_IN:
      return action.payload;
    case LOG_OUT:
      return action.payload;
    case GET_ACTIVE_PLAYER:
      return action.payload;
    default:
      return state;
  }
};
