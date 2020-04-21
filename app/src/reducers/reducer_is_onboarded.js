/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {GET_ONBOARDING, SET_ONBOARDING} from '../actions/index';

export default (state = true, action) => {
    switch (action.type) {
      case GET_ONBOARDING:
        return action.payload;
      case SET_ONBOARDING:
        return action.payload;
      default:
        return state;
    }
  };