/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { WELCOME_OPENED, WELCOME_CLOSED } from '../actions/index';

export default (state = {open: false }, action) => {
  switch (action.type) {
    case WELCOME_OPENED:
      return action.payload;
    case WELCOME_CLOSED:
      return action.payload;
    default:
      return state;
  }
};
