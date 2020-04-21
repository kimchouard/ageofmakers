/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { WALKTHROUGH_START, WALKTHROUGH_STOP} from '../actions/index';

export default (state = {start: false}, action) => {
    switch (action.type) {
      case WALKTHROUGH_START:
        return action.payload;
      case WALKTHROUGH_STOP:
        return action.payload;
      default:
        return state;
    }
  };