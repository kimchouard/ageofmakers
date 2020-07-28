/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import {wrapStore, alias} from 'react-chrome-redux';

import rootReducer from './reducers';
import aliases from './aliases';

// Store with middleware
const middlewares = [ alias(aliases), ReduxPromise ];
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const storeWithMiddleware = createStoreWithMiddleware(rootReducer);

wrapStore(storeWithMiddleware, {
  portName: 'ageofmakers',
});

// Clicking on the extension's icon opens the game.
chrome.browserAction.onClicked.addListener((tab) => {
  const gameUrl = chrome.extension.getURL('game.html');
  // console.log('Icon clicked', gameUrl, tab, tab.url);
  if (tab && tab.url != gameUrl) {
    chrome.tabs.create({url: gameUrl});
  }
});

(function() {
  // Google Analytics in the background script
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
  
  setTimeout(() => {
    const gaPlugin = _gaq || [];
    gaPlugin.push(['_setAccount', 'UA-173708168-1']);
    gaPlugin.push(['_trackPageview']);
  }, 2000);
});