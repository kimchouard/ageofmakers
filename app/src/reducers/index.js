/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {combineReducers} from 'redux';

import activePlayer from './reducer_active_player';
import players from './reducer_players';
import journey from './reducer_journey';
import activeQuest from './reducer_active_quest';
import currentTab from './reducer_current_tab';
import bubbleToggled from './reducer_bubble_toggled';
import welcome from './reducer_welcome';
import tree from './reducer_tree';
import embeddedPage from './reducer_embedded_page';
import walkthrough from './reducer_walkthrough';

export default combineReducers({
  journey,
  activeQuest,
  bubbleToggled,
  currentTab,
  activePlayer,
  players,
  welcome,
  tree,
  embeddedPage,
  walkthrough
});
