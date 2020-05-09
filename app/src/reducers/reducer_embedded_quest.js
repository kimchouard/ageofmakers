/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { EMBEDDED_QUEST_OPENED, EMBEDDED_QUEST_CLOSED } from '../actions/index';

export default (state = { open: false }, action) => {
  switch (action.type) {
    case EMBEDDED_QUEST_OPENED:
      return action.payload;
    case EMBEDDED_QUEST_CLOSED:
      return action.payload;
    default:
      return state;
  }
};
