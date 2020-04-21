/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { QUESTS_PULLED, QUESTS_RELOAD, STAGE_CHANGE, QUESTS_NEWURL } from '../actions/index';

export default (state = [], action) => {
  switch (action.type) {
    case QUESTS_PULLED:
      return action.payload;
    case QUESTS_RELOAD:
      return action.payload;
    case QUESTS_NEWURL:
      return action.payload;
    case STAGE_CHANGE:
      return action.payload;
  }

  return state;
};
