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
        let achievements = storage.players[storage.activePlayer].achievements[storage.players[storage.activePlayer].journey];

        chrome.storage.local.get(['quests', 'ages', 'areas', 'credits'], (items) => {
          let quests = items.quests;
          let ages = items.ages;
          let areas = items.areas;
          let credits = items.credits;
          console.log('Achievements: ', achievements, quests, ages, areas, credits);

          if (quests && ages && areas) {
            if (achievements && achievements.quests) {
              // Changing Quests status based on achievements
              for(let achievedQuestId of Object.keys(achievements.quests)) {
                let achievement = achievements.quests[achievedQuestId];
                let achievedQuest = quests[achievedQuestId];

                if (achievedQuest) {
                  for(let stage of achievedQuest.stages) {
                    // If the completed stage or before -> complete
                    if (achievement.stageNumber !== null && stage.order <= achievement.stageNumber) {
                      stage.status = stageStatus.STATUS_COMPLETE;
                    }
                    // If RIGHT after completed stage -> inProgress
                    else if (stage.order === achievement.stageNumber+1) {
                      stage.status = stageStatus.STATUS_INPROGRESS;
                    }
                    // If at least 2nd after completeed stage -> new
                    else {
                      stage.status = stageStatus.STATUS_NEW;
                    }
                    
                    // If some showcase items has been completed
                    if(achievement.showcasesVisited && achievement.showcasesVisited !== {}) {
                      for(let visitedStageOrder of Object.keys(achievement.showcasesVisited)) {
                        if (stage.order === parseInt(visitedStageOrder)) {
                          let showcaseResults = achievement.showcasesVisited[visitedStageOrder];

                          for(let visitedShowcaseOrder of Object.keys(showcaseResults)) {
                            for(let showcaseItem of stage.showcaseItems) {
                              if (showcaseItem.order === parseInt(visitedShowcaseOrder)) {
                                showcaseItem.status = stageStatus.STATUS_COMPLETE;

                                // If the achievement is an object
                                if (typeof showcaseResults[visitedShowcaseOrder] === "object") {
                                  showcaseItem.results = showcaseResults[visitedShowcaseOrder];
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  };

                  // If last stage completed,:
                  // - if the achieved quest doesn't have a quiz, completing all the stages is sufficient so the quest is completed too!
                  // - if the quest have a quiz, we need to make sure the quiz is done too
                  if (achievement.stageNumber !== null && ( achievedQuest.stages.length === 0 || achievement.stageNumber >= achievedQuest.stages[achievedQuest.stages.length - 1].order)
                   && ( !achievedQuest.quiz || (achievedQuest.quiz && achievedQuest.quiz.questions && achievement.quiz && Object.keys(achievement.quiz).length === achievedQuest.quiz.questions.length) ) ) {
                      quests[achievedQuestId].status = stageStatus.STATUS_COMPLETE;
                      if (achievedQuest.quiz) {
                        quests[achievedQuestId].quiz.results = achievement.quiz;
                      }
                  }
                  else {
                    quests[achievedQuestId].status = stageStatus.STATUS_INPROGRESS;
                  }
                }
              };
            }

            // Misc. Quests object manipulations
            for(let questId in quests) {
              let currentQuest = quests[questId];
              if(currentQuest) {
                // Enforce the default "website" Quest type
                if(!currentQuest.type) {
                  quests[questId].type = 'website';
                }

                // Set status to NEW if not present
                if(currentQuest && !currentQuest.status) {
                  quests[questId].status = stageStatus.STATUS_NEW;
                }

                // Adding following
                if(currentQuest.prerequisites) {
                  currentQuest.prerequisites.forEach((prerequisiteId) => {
                    // If the prerequesite is a questID (and not a age requirement, etc)
                    if (typeof prerequisiteId === 'string') {
                      let neededQuests = quests[prerequisiteId]

                      if (neededQuests) {
                        if(Array.isArray(neededQuests.following)) {
                          quests[prerequisiteId].following.push(currentQuest.id);
                        }
                        else {
                          quests[prerequisiteId].following = [currentQuest.id];
                        }
                      }
                      else {
                        console.error(`Innexistant quest ${prerequisiteId} from ${questId}`, currentQuest);
                      }
                    }
                  })
                }
              } 
            }

            console.log('Quests & Ages retrieved!', quests, ages, areas, credits);
            callback({ quests, ages, areas, credits });
          }
          else {
            console.error('Error while loading the full quests', quests, ages, areas, credits);
          }
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
  if (journeyId) {
    const questsUrl = chrome.runtime.getURL(`data/${journeyId}/quests.yaml`);
    const agesUrl = chrome.runtime.getURL(`data/${journeyId}/ages.yaml`);
    const areasUrl = chrome.runtime.getURL(`data/${journeyId}/areas.yaml`);
    const creditsUrl = chrome.runtime.getURL(`data/${journeyId}/credits.yaml`);
    fetch(questsUrl)
      .then((questsResponse) => {
      if (questsResponse.status !== 200) {
        console.error('Error while loading quests:', res);
        return resolve({ error: questsResponse.status });
      }

      // Examine the text in the questsResponse
      questsResponse.text().then((questsData) => {
        // console.log('Yaml data', questsData);
        let questsArray = yaml.safeLoadAll(questsData);
        let quests = {};
        for (const quest of questsArray) {
          quests[quest.id] = quest;
        }

        fetch(agesUrl)
        .then((agesResponse) => {
          if (agesResponse.status !== 200) {
            console.error('Error while loading ages:', res);
            return resolve({ error: agesResponse.status });
          }
          
          // Examine the text in the agesResponse
          agesResponse.text().then((agesData) => {
            // console.log('Yaml quest data', agesData);
            let ages = yaml.safeLoadAll(agesData)[0];

            fetch(areasUrl)
            .then((areasResponse) => {
              if (areasResponse.status !== 200) {
                console.error('Error while loading areas:', res);
                return resolve({ error: areasResponse.status });
              }
              
              // Examine the text in the areasResponse
              areasResponse.text().then((areasData) => {
                // console.log('Yaml quest data', areasData);
                let areas = yaml.safeLoadAll(areasData)[0];

                fetch(creditsUrl)
                .then((creditsResponse) => {
                  if (creditsResponse.status !== 200) {
                    console.error('Error while loading credits:', res);
                    return resolve({ error: creditsResponse.status });
                  }
                  
                  // Examine the text in the creditsResponse
                  creditsResponse.text().then((creditsData) => {
                    // console.log('Yaml quest data', creditsData);
                    let credits = yaml.safeLoadAll(creditsData)[0];

                    chrome.storage.local.set({ quests, ages, areas, credits }, () => {
                      console.log('Quests, Ages, Areas & Credits saved!', quests, ages, areas, credits);

                      getFullQuestWithAchievements((fullQuests) => {
                        resolve(fullQuests);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
}

const updatePlayersData = (field, originalAction, reset) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    if (originalAction.payload && originalAction.payload.mock) {
      chrome.storage.sync.get(['players', 'activePlayer'], (storage) => {
        if (storage && storage.players && storage.activePlayer != null) {
          let players = storage.players;
          let activePlayerId = storage.activePlayer;
          let activePlayer = players[activePlayerId];
          let playersJourney = players[activePlayerId].journey;

          if (reset) {
            delete activePlayer[field];
          }
          else {
            let value = (field === 'sdg') ? originalAction.payload.sdgNumber : (field === 'onboarded') ? originalAction.payload.onboarded : originalAction.payload.journeyId;
            console.log(`Updating ${activePlayerId}.${field}: ${value}`);
            activePlayer[field] = value;
          }

          // If setting the players journey, make sure that the related achievements data structure is created, if not there already
          if(field === 'journey' && !reset) {
            if (!players[activePlayerId].achievements[originalAction.payload.journeyId]) {
              players[activePlayerId].achievements[originalAction.payload.journeyId] = {
                age: null,
                quests: {},
              }
            }
          }

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
          if (playersKeys.length > 0) {
            let newId = parseInt(playersKeys[playersKeys.length-1]) + 1;
            newPlayer.id = newId.toString();
          }
          else {
            newPlayer.id = "0";
          }
          
  
          players[newPlayer.id] = newPlayer;
        }
        // That means that it's the first player to be saved ever!
        else {
          newPlayer.id = "0";
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
const setPlayerOnboarding = (originalAction) => {
  return updatePlayersData('onboarded', originalAction);
}

// originalAction.payload params: sdgNumber
const setActivePlayerSDG = (originalAction) => {
  return updatePlayersData('sdg', originalAction);
}

// originalAction.payload params: journeyId
const setActivePlayerJourney = (originalAction) => {
  return updatePlayersData('journey', originalAction);
}

// originalAction.payload params: journeyId
const resetActivePlayerJourney = (originalAction) => {
  return updatePlayersData('journey', originalAction, true);
}

const getPlayers = (originalAction) => {
  return getChromeSyncStorage(originalAction, 'players', (resolve) => {
    console.error('Error while loading the player list');
    resolve({});
  });
};

// originalAction.payload params: playerJourney, newAge
const changeAge = (originalAction) => {
  // TODO: API to update the user records
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    if (originalAction.payload && originalAction.payload.mock) {
      console.log(`Updating player's journey ${originalAction.payload.playerJourney} with age: ${originalAction.payload.newAge}`);

      chrome.storage.sync.get(['players', 'activePlayer'], (storage) => {
        if (storage && storage.players && storage.activePlayer) {
          let players = storage.players;
          let activePlayerId = storage.activePlayer;
          let playersJourney = players[activePlayerId].journey;

          if (players[activePlayerId].achievements[playersJourney] && players[activePlayerId].achievements[playersJourney].age >= 0) {
            console.log("Updating user's age:", originalAction.payload);
            players[activePlayerId].achievements[playersJourney].age = originalAction.payload.newAge;
          } 
          else {
            console.error('Can not retrieve proper achievement object', players, activePlayerId, playersJourney);
          }

          chrome.storage.sync.set({ players }, () => {
            resolve(players);
          });
        }
        else {
          console.error('Players not found or no player logged in.', storage);
        }
      });
    }
  }));
}


// =============================================
//            QUESTS
// =============================================

// originalAction.payload params: journeyId
const reloadQuests = (originalAction) => {
  if (originalAction.payload) {
    return middlewarePromise(originalAction, new Promise((resolve, reject) => {
      loadQuests(originalAction.payload.journeyId, resolve);
    }));
  }
  else {
    return originalAction;
  }
};

const resetQuests = (originalAction) => {
  console.log('Resetting Quests, ages & areas data');
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    // Remove the current quests to force a reload
    chrome.storage.local.remove(['quests', 'ages', 'areas'], () => {
      resolve({})
    });
  }));
};

const getQuests = (originalAction) => {
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    getFullQuestWithAchievements((fullQuests) => {
      resolve(fullQuests);
    });
  }));
};

// originalAction.payload params: activeQuestKey, achievedStageNumber, achievedShowcaseNumber (optional), quizResults (optional)
const changeQuestProgress = (originalAction) => {
  // TODO: API to update the user records
  return middlewarePromise(originalAction, new Promise((resolve, reject) => {
    if (originalAction.payload && originalAction.payload.mock) {
      console.log(`Updating ${originalAction.payload.activeQuestKey} with achieved stage: ${originalAction.payload.achievedStageNumber} or achieved showcase: ${originalAction.payload.achievedShowcaseNumber} with quiz results: ${originalAction.payload.quizResults}`);

      chrome.storage.sync.get(['players', 'activePlayer'], (storage) => {
        if (storage && storage.players && storage.activePlayer) {
          let players = storage.players;
          let activePlayerId = storage.activePlayer;
          let playersJourney = players[activePlayerId].journey;

          if (originalAction.payload.achievedStageNumber === 'none') {
            delete players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey];
          }
          else {
            // If a scaffolding of the achievements hasn't been created yet
            if (!players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey]) {
              players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey] = {
                stageNumber: null,
                quiz: {},
                showcasesVisited: {},
              }
            }

            // If the progress change about a showcase
            if (originalAction.payload.achievedShowcaseNumber !== null && originalAction.payload.achievedShowcaseNumber >= 0) {
              if (!players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey].showcasesVisited[originalAction.payload.achievedStageNumber]) {
                players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey].showcasesVisited[originalAction.payload.achievedStageNumber] = {};
              }

              players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey].showcasesVisited[originalAction.payload.achievedStageNumber][originalAction.payload.achievedShowcaseNumber] = originalAction.payload.quizResults || true;
            }
            // If the progress change about the quiz
            else if (originalAction.payload.quizResults) {
              players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey].quiz = originalAction.payload.quizResults;
            }
            else {
              players[activePlayerId].achievements[playersJourney].quests[originalAction.payload.activeQuestKey].stageNumber = originalAction.payload.achievedStageNumber;
            }
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
      if (tabs[0]) {
        resolve(tabs[0]);
      }
      else {
        resolve(null);
      }
    });
  }));
}

export default {
  QUESTS_PULLED: getQuests,
  GET_CURRENT_TAB: getCurrentTab,
  QUESTS_RELOAD: reloadQuests,
  QUESTS_RESET: resetQuests,
  LOG_IN: logIn,
  LOG_OUT: logOut,
  GET_ACTIVE_PLAYER: getActivePlayer,
  SET_NEW_PLAYER: setNewPlayer,
  GET_PLAYERS: getPlayers,
  SET_PLAYER_ONBOARDING: setPlayerOnboarding,
  SET_PLAYER_SDG: setActivePlayerSDG,
  SET_PLAYER_JOURNEY: setActivePlayerJourney,
  RESET_PLAYER_JOURNEY: resetActivePlayerJourney,
  REMOVE_PLAYER: removePlayer,
  STAGE_CHANGE: changeQuestProgress,
  AGE_CHANGE: changeAge
};