/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { TOGGLE_BUBBLE } from '../actions/index';

export default (state = true, action) => {
  switch (action.type) {
    case TOGGLE_BUBBLE:
      return action.payload;
    default:
      return state;
  }
};
