/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Store} from 'react-chrome-redux';

import App from './content/components/app';

require('../sass/_bubble.scss');

const proxyStore = new Store({
  portName: 'ageofmakers'
});

const anchor = document.createElement('div');
anchor.id = 'ageofmakers';

document.body.insertBefore(anchor, document.body.childNodes[0]);

const unsubscribe = proxyStore.subscribe(() => {
  unsubscribe(); // make sure to only fire once
  render(
    <Provider store={proxyStore}>
      <App/>
    </Provider>
    , document.getElementById('ageofmakers'));
});
