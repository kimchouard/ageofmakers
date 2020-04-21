/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { GET_CURRENT_TAB } from '../actions/index';

export default (state = null, action) => {
  switch (action.type) {
    case GET_CURRENT_TAB:
      return action.payload;
  }

  return state;
};
