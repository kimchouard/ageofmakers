/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// =========================================
//         Action Type Consts
// =========================================

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const GET_ACTIVE_PLAYER = 'GET_ACTIVE_PLAYER';
export const SET_NEW_PLAYER = 'SET_NEW_PLAYER';
export const GET_PLAYERS = 'GET_PLAYERS';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const SET_PLAYER_SDG = 'SET_PLAYER_SDG';
export const SET_PLAYER_JOURNEY = 'SET_PLAYER_JOURNEY';
export const GET_CURRENT_TAB = 'GET_CURRENT_TAB';
export const QUESTS_RELOAD = 'QUESTS_RELOAD';
export const QUESTS_RESET = 'QUESTS_RESET';
export const QUESTS_PULLED = 'QUESTS_PULLED';
export const QUESTS_NEWURL = 'QUESTS_NEWURL';
export const QUEST_STARTED = 'QUEST_STARTED';
export const QUEST_SELECTED = 'QUEST_SELECTED';
export const QUEST_UNSELECTED = 'QUEST_UNSELECTED';
export const QUEST_NEWTAB = 'QUEST_NEWTAB';
export const QUEST_BACKNEWTAB = 'QUEST_BACKNEWTAB';
export const TOGGLE_BUBBLE = 'TOGGLE_BUBBLE';
export const STAGE_CHANGE = 'STAGE_CHANGE';
export const WELCOME_OPENED = 'WELCOME_OPENED';
export const WELCOME_CLOSED = 'WELCOME_CLOSED';
export const TREE_OPENED = 'TREE_OPENED';
export const TREE_CLOSED = 'TREE_CLOSED';
export const EMBEDDED_QUEST_OPENED = 'EMBEDDED_QUEST_OPENED';
export const EMBEDDED_QUEST_CLOSED = 'EMBEDDED_QUEST_CLOSED';
export const KANBAN_OPENED = 'KANBAN_OPENED';
export const KANBAN_CLOSED = 'KANBAN_CLOSED';
export const WALKTHROUGH_START = 'WALKTHROUGH_START';
export const WALKTHROUGH_STOP = 'WALKTHROUGH_STOP';
export const GET_ONBOARDING = 'GET_ONBOARDING';
export const SET_ONBOARDING = 'SET_ONBOARDING';

// =========================================
//         Active Player
// =========================================

// Mock action. Full in alias
export function logIn(userID) {
  return {
    type: LOG_IN,
    payload: { mock: true, userID },
  };
}

// Mock action. Full in alias
export function logOut() {
  return {
    type: LOG_OUT,
    payload: { mock: true },
  };
}

// Mock action. Full in alias
export function getActivePlayer() {
  return {
    type: GET_ACTIVE_PLAYER,
    payload: { mock: true },
  };
}

// Mock action. Full in alias
export function setActivePlayerSDG(sdgNumber) {
  return {
    type: SET_PLAYER_SDG,
    payload: { mock: true, sdgNumber },
  };
}

// Mock action. Full in alias
export function setActivePlayerJourney(journeyId) {
  return {
    type: SET_PLAYER_JOURNEY,
    payload: { mock: true, journeyId },
  };
}


// =========================================
//         Players
// =========================================

// Mock action. Full in alias
export function setNewPlayer(name) {
  return {
    type: SET_NEW_PLAYER,
    payload: { mock: true, name },
  };
}

// Mock action. Full in alias
export function getPlayers() {
  return {
    type: GET_PLAYERS,
    payload: { mock: true },
  };
}

// Mock action. Full in alias
export function removePlayer(id) {
  return {
    type: REMOVE_PLAYER,
    payload: { mock: true, id },
  };
}


// =========================================
//         Current Tab
// =========================================

// Mock action. Promise in alias
// Used to trigger chrome.tabs.getCurrent from the background script
export function getCurrentTab() {
  return {
    type: GET_CURRENT_TAB,
    payload: { mock: true },
  };
}


// =========================================
//         Quests
// =========================================

// Mock action. Promise in alias
export function getQuests() {
  return {
    type: QUESTS_PULLED,
    payload: { mock: true },
  };
}

// Mock action. Promise in alias
export function reloadQuests(journeyId) {
  return {
    type: QUESTS_RELOAD,
    payload: { mock: true, journeyId },
  };
}

// Mock action. Promise in alias
export function resetQuests() {
  return {
    type: QUESTS_RESET,
    payload: { mock: true },
  };
}

export function updateQuestUrl(quests, activeQuest, newUrl) {
  quests[activeQuest].startUrl = newUrl;

  return {
    type: QUESTS_NEWURL,
    payload: quests
  };
}

// Mock action. Full in alias
export function changeStage(activeQuestKey, achievedStageNumber) {
  return {
    type: STAGE_CHANGE,
    payload: { mock: true, activeQuestKey, achievedStageNumber },
  };
}


// =========================================
//         Active Quest
// =========================================

export function selectQuest(questId) {
  return {
    type: QUEST_SELECTED,
    payload: {
      quest: questId
    },
  };
}

export function startQuest(questId, tabId) {
  return {
    type: QUEST_STARTED,
    payload: {
      quest: questId,
      tab: tabId
    },
  };
}

export function unselectQuest(currentTab) {
  return {
    type: QUEST_UNSELECTED,
    payload: currentTab
  };
}

export function backToNewTab(questId) {
  return {
    type: QUEST_BACKNEWTAB,
    payload: {
      quest: questId,
    }
  };
}

export function openNewTab(questId) {
  let payload = (questId) ? { quest: questId } : null;
  
  return {
    type: QUEST_NEWTAB,
    payload,
  };
}


// =========================================
//         Bubble Toggled
// =========================================

// Reverse bubble boolean: if True -> False else -> True
export function toggleBubble(bubbleToggled) {
  return {
    type: TOGGLE_BUBBLE,
    payload: !bubbleToggled,
  };
}

// =========================================
//         Welcome Page
// =========================================

// Open the profile page
export function openWelcome() {
  return {
    type: WELCOME_OPENED,
    payload: {
      open: true
    },
  };
}

// Close the profile page
export function closeWelcome() {
  return {
    type: WELCOME_CLOSED,
    payload: {
      open: false
    },
  };
}

// =========================================
//         Tree Page
// =========================================

// Open the profile page
export function openTree() {
  return {
    type: TREE_OPENED,
    payload: {
      open: true
    },
  };
}

// Close the profile page
export function closeTree() {
  return {
    type: TREE_CLOSED,
    payload: {
      open: false
    },
  };
}

// =========================================
//         Showcase Page
// =========================================

// Open the profile page
export function openEmbeddedQuest() {
  return {
    type: EMBEDDED_QUEST_OPENED,
    payload: {
      open: true,
    },
  };
}

// Close the profile page
export function closeEmbeddedQuest() {
  return {
    type: EMBEDDED_QUEST_CLOSED,
    payload: {
      open: false
    },
  };
}

// =========================================
//         Walkthrough
// =========================================

// Start the walkthrough
export function startWalkthrough(type) {
  return {
    type: WALKTHROUGH_START,
    payload: {
      start: type
    },
  };
}

// Stop the walkthrough
export function stopWalkthrough() {
  return {
    type: WALKTHROUGH_STOP,
    payload: {
      start: 0
    },
  };
}

// =========================================
//         Onboarding
// =========================================

export function getOnboarding() {
  return {
    type: GET_ONBOARDING,
    payload: { mock: true },
  };
}

export function setOnboarding(boolean) {
  return {
    type: SET_ONBOARDING,
    payload: { mock: true, boolean},
  };
}



