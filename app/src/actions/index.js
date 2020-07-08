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
export const SET_PLAYER_ONBOARDING = 'SET_PLAYER_ONBOARDING';
export const SET_PLAYER_SDG = 'SET_PLAYER_SDG';
export const SET_PLAYER_JOURNEY = 'SET_PLAYER_JOURNEY';
export const RESET_PLAYER_JOURNEY = 'RESET_PLAYER_JOURNEY';
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
export const AGE_CHANGE = 'AGE_CHANGE';
export const WELCOME_OPENED = 'WELCOME_OPENED';
export const WELCOME_CLOSED = 'WELCOME_CLOSED';
export const TREE_OPENED = 'TREE_OPENED';
export const TREE_CLOSED = 'TREE_CLOSED';
export const EMBEDDED_QUEST_OPENED = 'EMBEDDED_QUEST_OPENED';
export const EMBEDDED_CREDITS_OPENED = 'EMBEDDED_CREDITS_OPENED';
export const EMBEDDED_PAGE_CLOSED = 'EMBEDDED_PAGE_CLOSED';
export const KANBAN_OPENED = 'KANBAN_OPENED';
export const KANBAN_CLOSED = 'KANBAN_CLOSED';
export const WALKTHROUGH_START = 'WALKTHROUGH_START';
export const WALKTHROUGH_STOP = 'WALKTHROUGH_STOP';

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

export function setPlayerOnboarding(onboarded) {
  return {
    type: SET_PLAYER_ONBOARDING,
    payload: { mock: true, onboarded},
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

// Mock action. Full in alias
export function resetActivePlayerJourney() {
  return {
    type: RESET_PLAYER_JOURNEY,
    payload: { mock: true },
  };
}

// Mock action. Full in alias
export function changeAge(newAge) {
  return {
    type: AGE_CHANGE,
    payload: { mock: true, newAge },
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
  if (journeyId) {
    return {
      type: QUESTS_RELOAD,
      payload: { mock: true, journeyId },
    };
  }
  else {
    console.log('No journey specified for quest reload, returning empty quests');
    return {
      type: QUESTS_RELOAD,
      payload: { },
    };
  }
}

// Mock action. Promise in alias
export function resetQuests() {
  return {
    type: QUESTS_RESET,
    payload: { mock: true },
  };
}

//  TODO ==> update to be journey vs quests
export function updateQuestUrl(quests, activeQuest, newUrl) {
  quests[activeQuest].startUrl = newUrl;

  return {
    type: QUESTS_NEWURL,
    payload: quests
  };
}

// Mock action. Full in alias
export function changeQuestProgress(activeQuestKey, achievedStageNumber, achievedShowcaseNumber, quizResults) {
  return {
    type: STAGE_CHANGE,
    payload: { mock: true, activeQuestKey, achievedStageNumber, achievedShowcaseNumber, quizResults },
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

export function startQuest(questId, tabId, showcaseOrder) {
  return {
    type: QUEST_STARTED,
    payload: {
      quest: questId,
      tab: tabId,
      showcase: showcaseOrder,
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

// Open the embedded page for quests
export function openEmbeddedQuest() {
  return {
    type: EMBEDDED_QUEST_OPENED,
    payload: {
      open: true,
      type: 'quest',
    },
  };
}

// Open the embedded page for quests
export function openEmbeddedCredits() {
  return {
    type: EMBEDDED_CREDITS_OPENED,
    payload: {
      open: true,
      type: 'credits',
    },
  };
}

// Close the embedded page
export function closeEmbeddedPage() {
  return {
    type: EMBEDDED_PAGE_CLOSED,
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