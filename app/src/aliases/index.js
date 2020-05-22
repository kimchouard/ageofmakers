/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { SET_NEW_PLAYER } from '../actions'
import { stageStatus } from '../scripts/_utils';
import yaml from 'js-yaml';

// =============================================
//            UTILS
// =============================================

const middlewarePromise = (originalAction, promise) => {
  // If it's a mock action, we return the promise
  if (originalAction.payload && originalAction.payload.mock) {
    return {
      type: originalAction.type,
      payload: promise
    };
  }
  // If it's not mock, means that we've resolved the promise and the middleware sent it over
  else {
    return originalAction;
  }
}

// Async call to get some values in the storage
const getChromeStorage = (originalAction, itemName, errCallback) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    // Save sid in chrome session
    chrome.storage.local.get(itemName, (items) => {
      let item = items[itemName]
      if (item) {
        resolve(item);
      }
      else {
        console.log('Item not found: ', itemName);
        errCallback(resolve);
      }
    })
  }));
}

// Async call to get some values in the storage
const getChromeSyncStorage = (originalAction, itemName, errorCb) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    // Save sid in chrome session
    chrome.storage.sync.get(itemName, (storage) => {
      if (storage && storage[itemName]) {
        resolve(storage[itemName]);
      }
      else {
        errorCb(resolve);
      }
    })
  }));
}

const setChromeSyncStorage = (originalAction, newStorageObj, cb) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    chrome.storage.sync.set(newStorageObj, () => {
      cb(resolve);
    });
  }));
}

const removeChromeSyncStorage = (originalAction, itemName, cb) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    chrome.storage.sync.remove(itemName, () => {
      cb(resolve);
    });
  }));
}

const getFullQuestWithAchievements = (callback) => {
  chrome.storage.sync.get(['players', 'activePlayer'], (storage) => {
    if (storage && storage.players && storage.activePlayer) {
      if (storage.players[storage.activePlayer]) {
        let achievements = storage.players[storage.activePlayer].achievements;

        chrome.storage.local.get('quests', (items) => {
          let quests = items.quests;
          console.log('Achievements: ', achievements, quests);

          // Changing Quests status based on achievements
          Object.keys(achievements).forEach((achievedQuest) => {
            let completedStageOrder = achievements[achievedQuest];
            if (quests[achievedQuest]) {
              quests[achievedQuest].stages.forEach((stage) => {
                // If the completed stage or before -> complete
                if (stage.order <= completedStageOrder) {
                  stage.status = stageStatus.STATUS_COMPLETE;
                }
                // If RIGHT after completed stage -> inProgress
                else if (stage.order === completedStageOrder+1) {
                  stage.status = stageStatus.STATUS_INPROGRESS;
                }
                // If at least 2nd after completeed stage -> new
                else {
                  stage.status = stageStatus.STATUS_NEW;
                }
              });

              // If last stage completed, the quest is completed too!
              if (completedStageOrder >= quests[achievedQuest].stages[quests[achievedQuest].stages.length - 1].order) {
                quests[achievedQuest].status = stageStatus.STATUS_COMPLETE;
              }
              else {
                quests[achievedQuest].status = stageStatus.STATUS_INPROGRESS;
              }
            }
          });

          // Changing Quests status based on achievements
          for(let questId in quests) {
            // Enforce the default "website" Quest type
            if(quests[questId] && !quests[questId].type) {
              quests[questId].type = 'website';
            }

            if(quests[questId] && !quests[questId].status) {
              quests[questId].status = stageStatus.STATUS_NEW;
            }
          }

          callback(quests);
        }); 
      }
      else {
        // Log out!!
        console.log('Logging out deleted user');
        chrome.storage.sync.set({ activePlayer: -1 }, () => {
          callback();
        });
      }
    };
  });
}

const loadQuests = (journeyId, resolve) => {
  const questsUrl = chrome.runtime.getURL(`data/${journeyId}/quests.yaml`);
  fetch(questsUrl)
    .then((response) => {
    if (response.status !== 200) {
      console.error('Error while changing quest state:', res);
      return resolve({ error: response.status });
    }

    // // Examine the text in the response
    response.text().then((questsData) => {
      // console.log('Yaml data', questsData);
      let questsArray = yaml.safeLoadAll(questsData);
      let quests = {};
      for (const quest of questsArray) {
        quests[quest.id] = quest;
      }

      chrome.storage.local.set({ quests }, () => {
        console.log('Quests saved!', quests);

        getFullQuestWithAchievements((fullQuests) => {
          resolve(fullQuests);
        });
      });

    });
  });
}

const updatePlayersData = (field, originalAction) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    if (originalAction.payload && originalAction.payload.mock) {
      chrome.storage.sync.get(['players', 'activePlayer'], (storage) => {
        if (storage && storage.players && storage.activePlayer) {
          let players = storage.players;
          let activePlayerId = storage.activePlayer;

          let value = (field === 'sdg') ? originalAction.payload.sdgNumber : originalAction.payload.journeyId;

          console.log(`Updating ${activePlayerId}.${field}: ${value}`);

          players[activePlayerId][field] = value;

          chrome.storage.sync.set({ players }, () => {
            resolve(players);
          });
        }
        else {
          console.error('Players not found or no played logged in.', storage);
        }
      });
    }
  }));
}


// =============================================
//            ACTIVE PLAYER
// =============================================

const logIn = (originalAction) => {
  let activePlayer = originalAction.payload.userID;
  return setChromeSyncStorage(originalAction, { activePlayer }, (resolve) => {
    resolve(activePlayer);
  });
};

const logOut = (originalAction) => {
  return setChromeSyncStorage(originalAction, { activePlayer: -1 }, (resolve) => {
    resolve(-1);
  });
};

const getActivePlayer = (originalAction) => {
  return getChromeSyncStorage(originalAction, 'activePlayer', 
  (resolve) => { // if no active player is returned
    resolve(-1);
  });
};

// =============================================
//            PLAYERS
// =============================================

const setNewPlayer = (originalAction) => {
  if (originalAction && originalAction.payload && originalAction.payload.name) {
    let newPlayer = {
      name: originalAction.payload.name,
      onboarded: false,
      achievements: {},
    };
  
    return middlewarePromise(originalAction, new Promise((resolve, reject) => {
      // Creating the variable in which the players will be stored
      let players;
      // Save sid in chrome session
      chrome.storage.sync.get('players', (storage) => {
        if (storage && storage.players) {
          players = storage.players;
          
          // Create a new id for the new player
          let playersKeys = Object.keys(players);
          let newId;
          if (playersKeys.length > 0) {
            newId = parseInt(playersKeys[playersKeys.length-1]) + 1;
          }
          else {
            newId = 0;
          }
          
  
          players[newId] = newPlayer;
        }
        // That means that it's the first player!
        else {
          players = {
            0: newPlayer
          };
        }
  
        chrome.storage.sync.set({ players }, () => {
          resolve(players);
        });
      })
    }));
  }
  else {
    return {
      type: SET_NEW_PLAYER,
      payload: null,
    };
  }
};

const removePlayer = (originalAction) => {
  let playerToBeRemoved = originalAction.payload.id;

  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    // Creating the variable in which the players will be stored
    let players;
    // Save sid in chrome session
    chrome.storage.sync.get('players', (storage) => {
      if (storage && storage.players) {
        players = storage.players;
        delete players[playerToBeRemoved];

        chrome.storage.sync.set({ players }, () => {
          resolve(players);
        });
      }
    })
  }));
};

// originalAction.payload params: sdgNumber
const setActivePlayerSDG = (originalAction) => {
  return updatePlayersData('sdg', originalAction);
}

// originalAction.payload params: journeyId
const setActivePlayerJourney = (originalAction) => {
  return updatePlayersData('journey', originalAction);
}

const getPlayers = (originalAction) => {
  return getChromeSyncStorage(originalAction, 'players');
};


// =============================================
//            QUESTS
// =============================================

// originalAction.payload params: journeyId
const reloadQuests = (originalAction) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    loadQuests(originalAction.payload.journeyId, resolve);
  }));
};

const getQuests = (originalAction) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    getFullQuestWithAchievements((fullQuests) => {
      resolve(fullQuests);
    });
  }));
};

// originalAction.payload params: activeQuestKey, achievedStageNumber
const changeStage = (originalAction) => {
  // TODO: API to update the user records
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    if (originalAction.payload && originalAction.payload.mock) {
      console.log(`Updating ${originalAction.payload.activeQuestKey} with achieved stage: ${originalAction.payload.achievedStageNumber}`);

      chrome.storage.sync.get(['players', 'activePlayer'], (storage) => {
        if (storage && storage.players && storage.activePlayer) {
          let players = storage.players;
          let activePlayerId = storage.activePlayer;

          if (originalAction.payload.achievedStageNumber === 'none') {
            delete players[activePlayerId].achievements[originalAction.payload.activeQuestKey];
          }
          else {
            players[activePlayerId].achievements[originalAction.payload.activeQuestKey] = originalAction.payload.achievedStageNumber;
          }

          chrome.storage.sync.set({ players }, () => {
            getFullQuestWithAchievements((quests) => {
              resolve(quests);
            })
          });
        }
        else {
          console.error('Players not found or no played logged in.', storage);
        }
      });
    }
  }));
}


// =============================================
//            TABS
// =============================================

const getCurrentTab = (originalAction) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    // Async call to get current tab
    chrome.tabs.query({ active:true, windowType:"normal", currentWindow: true }, (tabs) => {
      console.log('Current tabs:', tabs);
      resolve(tabs[0]);
    });
  }));
}

// =============================================
//            ONBOARDING
// =============================================

const getOnboarding = (originalAction) => {
  return getChromeStorage(originalAction, 'onboarding', (resolve) =>{
    resolve(false);
    console.log('Onboarding not found in local storage.')
  });
}

const setOnboarding = (originalAction) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    chrome.storage.local.set({ onboarding: originalAction.payload.boolean }, () => {
      console.log('Onboarding stored.')
      resolve(originalAction.payload.boolean);
    });
  }));
}

export default {
  QUESTS_PULLED: getQuests,
  GET_CURRENT_TAB: getCurrentTab,
  QUESTS_RELOAD: reloadQuests,
  LOG_IN: logIn,
  LOG_OUT: logOut,
  GET_ACTIVE_PLAYER: getActivePlayer,
  SET_NEW_PLAYER: setNewPlayer,
  GET_PLAYERS: getPlayers,
  SET_PLAYER_SDG: setActivePlayerSDG,
  SET_PLAYER_JOURNEY: setActivePlayerJourney,
  REMOVE_PLAYER: removePlayer,
  STAGE_CHANGE: changeStage,
  GET_ONBOARDING: getOnboarding,
  SET_ONBOARDING: setOnboarding
};