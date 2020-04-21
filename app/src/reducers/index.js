/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {combineReducers} from 'redux';

import activePlayer from './reducer_active_player';
import players from './reducer_players';
import quests from './reducer_quests';
import activeQuest from './reducer_active_quest';
import currentTab from './reducer_current_tab';
import bubbleToggled from './reducer_bubble_toggled';
import welcome from './reducer_welcome';
import tree from './reducer_tree';
import walkthrough from './reducer_walkthrough';
import isOnboarded from './reducer_is_onboarded';

export default combineReducers({
  quests,
  activeQuest,
  bubbleToggled,
  currentTab,
  activePlayer,
  players,
  welcome,
  tree,
  walkthrough,
  isOnboarded
});
