/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export const journeyIds = {
  JOURNEY_MUSIC: 'music',
  JOURNEY_FTC: 'ftc',
};

export const stageStatus = {
  STATUS_COMPLETE: 'complete',
  STATUS_INPROGRESS: 'inProgress',
  STATUS_NEW: 'new',
};

export const questTypes = {
  WEBSITE: 'website',
  EMBEDDED: 'embedded',
}

export const stageTypes = {
  VIDEO: 'video',
  MUSIC_SHOWCASE: 'musicShowcase',
  FTC_SHOWCASE: 'ftcShowcase',
  KANBAN: 'kanban',
};

export const quizAnswerTypes = {
  FREETEXT: 'freetext',
  FREETEXTLONG: 'freetextlong',
  SMALLTEXT: 'smalltext',
  URL: 'url',
  NUMBER: 'number',
  PICKLIST: 'picklist',
  MUSICTHEORY: 'musictheory',
};

export const isQuestsLoaded = (props) => {
  return props && props.journey && props.journey.quests && Object.keys(props.journey.quests).length && !props.journey.quests.error
}

export const isLoggedIn = (props) => {
  return props.players && props.activePlayer && props.activePlayer !== -1 && props.activePlayerData && props.activePlayerData.journey;
}

export const isLoggedInAndLoaded = (props) => {
  return isQuestsLoaded(props) && isLoggedIn(props);
}

export const isNewAge = (activePlayerData, journey) => {
  if (activePlayerData && activePlayerData.achievements  && activePlayerData.journey && journey && activePlayerData.achievements[activePlayerData.journey] && journey.ages && journey.quests) {
    let achievementAgeIndex = activePlayerData.achievements[activePlayerData.journey].age;
    let currentAgeIndex = getAge(journey).index;
    // console.log('New Age check. Stored age:', achievementAgeIndex, 'Current age:', currentAgeIndex);

    // Either the saved aged is under the current one, or no ages are saved yet and we're after the first (0) age
    return ( achievementAgeIndex === null || achievementAgeIndex < currentAgeIndex);
  }
}

export const isOutdatedAge = (activePlayerData, journey) => {
  if (activePlayerData && activePlayerData.achievements  && activePlayerData.journey && journey && activePlayerData.achievements[activePlayerData.journey] && journey.ages && journey.quests) {
    let achievementAgeIndex = activePlayerData.achievements[activePlayerData.journey].age;
    let currentAgeIndex = getAge(journey).index;
    // console.log('Outdated Age check. Stored age:', achievementAgeIndex, 'Current age:', currentAgeIndex);

    // Either the saved aged is under the current one, or no ages are saved yet and we're after the first (0) age
    return ( typeof achievementAgeIndex !== "number" || achievementAgeIndex > currentAgeIndex);
  }
}

export const getAreaIconUrl = (pinQuest, journey, needWhiteIcon) => {
  let url;
  if (questUnlocked(pinQuest, journey) && journey && journey.areas) {
    let areaData = journey.areas[pinQuest.valley];

    if (areaData) {
      if (needWhiteIcon) {
        url = areaData.image;
      }
      else {
        url = areaData.imageGrey;
      }
    }
    else {
      console.error('Area Data not found for the quest', pinQuest);
    }
  }
  else {
    if (needWhiteIcon) {
      url = '/images/locked.svg';
    }
    else {
      url = '/images/locked_grey.svg';
    }
  }

  return chrome.extension.getURL(url);
}

export const getActivePlayerData = (state) => {
  return (state.players && state.activePlayer && state.activePlayer !== -1) ? state.players[state.activePlayer] : null;
}

export const getActiveQuestData = (state) => {
  // (isQuestsLoaded(state.quests) && state.activeQuest) ? state.quests[state.activeQuest.quest] : null,
  // (state.quests && state.activeQuest) ? state.quests[state.activeQuest.quest] : null
  return (isQuestsLoaded(state) && state.activeQuest) ? state.journey.quests[state.activeQuest.quest] : null;
}

export const getStageData = (activeQuest, stageOrder) => {
  let activeStage = null;
  
  // If the requested stage is the quiz
  if (stageOrder === -1) {
    activeStage = activeQuest.quiz;
  }
  // If we're requesting a regular quest
  else {
    activeQuest.stages.forEach((stage) => {
      if (stage.order === stageOrder) {
        activeStage = stage;
      }
    });  
  }
  
  if (!activeStage) {
    console.error(`Error: can't find active stage!`);
  }
  return activeStage;
}

export const getDefaultActiveStageOrder = (activeQuestData, embeddedPage) => {
  if(activeQuestData && activeQuestData.stages) {
    if (embeddedPage && embeddedPage.viewOrderId >= 0) {
      return embeddedPage.viewOrderId;
    }
    else {
      let defaultActiveStageOrder = 0;
      // defaultActiveStageOrder is -1 if we need to run the quiz!
      if ((!activeQuestData.stages.length || activeQuestData.stages[activeQuestData.stages.length-1].status === 'complete') && activeQuestData.quiz) {
        defaultActiveStageOrder = -1;
      }
      else {
        activeQuestData.stages.forEach((stage) => {
          if (stage.status === 'inProgress') {
            defaultActiveStageOrder = stage.order;
          }
        });
      }

      return defaultActiveStageOrder;
    }
  }
}

export const questUnlocked = (quest, journey) => {
  if (quest && quest.prerequisites === []) {
    return true; // no prerequisites
  }
  else if (quest) {
    for(let i = 0; i < quest.prerequisites.length; i++) {
      let questPreReq = quest.prerequisites[i];

      if (questPreReq.age) {
        let currentAge = getAge(journey);
        if (currentAge.index < questPreReq.age) {
          return false;
        }
      }
      else {
        let questNeeded = journey.quests[questPreReq];
        if (questNeeded) {

          if (!questUnlocked(questNeeded, journey)) {
            return false; // one of the INDIRECT prerequisites not completed
          }
          if (questNeeded.status !== 'complete') {
            return false; // one of the DIRECT prerequisites not completed
          }
        }
        else {
          return false; // one of the prerequisites not available... Kind of a bug if it ever happen
        }
      }
    };
  }
  else {
    console.error('Invalid quest passsed for questUnlock(...)', quest, journey);
    return false;
  }

  return true; // all prerequisites completed
};

// Utils to get the params from GET URL parameters
export const getParamsFromSearch = (search) => {
  let params = {};
  if(search) {
    let paramsArray = search.substr(1).split('&');
    paramsArray.forEach((param, index) => {
      let tmpArray = param.split('=');
      params[tmpArray[0]] = tmpArray[1];
    });
  }
  
  return params;
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  ca.forEach((cookie) => {
      while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1);
      }

      if (cookie.indexOf(name) == 0) {
          return cookie.substring(name.length, cookie.length);
      }
  });

  return "";
};

export const addComplete = (quests, valleyName, statusName = 'complete') => {
  // Skip if no quests loaded yet
  if (!quests) { return 0; }
  let complete = ''
  if (valleyName) {
    complete = Object.keys(quests).map( (questId) => {
        if ((quests[questId].status === statusName || !statusName) && quests[questId].valley === valleyName) {
          return 1;
        } else {
          return 0;
        }
    });
  } else {
    complete = Object.keys(quests).map( (questId) => {
      if (quests[questId].status === statusName || !statusName) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (complete && complete.length) {
    return complete.reduce((total, num) => {
      return total + Math.round(num);
    })
  }
  else {
    return 0;
  }
};

export const getRomanAge = (age) => {
  if(age.index === 0) { return "I"; }
  else if(age.index === 1) { return "II"; }
  else if(age.index === 2) { return "III"; }
  else if(age.index === 3) { return "IV"; }
  else if(age.index === 4) { return "V" }
  else { return "" }
}

export const getAge = (journey) => {
  if (journey && journey.ages && journey.quests) {
    for (let i = 0; i < journey.ages.length; i++) {
      let currentReqs = journey.ages[i].requirements;
      let currentValues = Object.keys(currentReqs).map( (valleyName) => {
        if (valleyName === "total") {
          if (typeof(currentReqs[valleyName]) === "string" && addComplete(journey.quests, null, null) === addComplete(journey.quests)){
            return "all";
          } else {
            return addComplete(journey.quests);
          }
        } else {
          if (typeof(currentReqs[valleyName]) === "string" && addComplete(journey.quests, valleyName, null) === addComplete(journey.quests, valleyName)){
            return "all";
          } else {
            return addComplete(journey.quests, valleyName)
          }
        }
      });
      // console.log('Age check for', i, newArray, Object.values(currentReqs), (newArray >= Object.values(currentReqs) && Object.values(currentReqs) !== -1), newArray === Object.values(currentReqs));
      let requirementsMet = true;
      for(let j = 0; j < currentValues.length; j++) {
        let currentReq = currentReqs[Object.keys(currentReqs)[j]];
        let currentValue = currentValues[j];
        if ((currentReq === 'all' && currentValue !== 'all') || (currentReq !== 'all' && currentValue < currentReq)) {
          requirementsMet = false;
        }
      }
  
      if (requirementsMet) {
        // console.log("Passed Age:", journey.ages[i].name)
        if (journey.ages[i].index + 1 === journey.ages.length) {
          // console.log("Returned Final Index!!!:", journey.ages[i].index)
          return(journey.ages[i])
        }
      } else {
        // console.log("Failed Age:", journey.ages[i].name)
        // console.log("Returned Index:", journey.ages[i].index) Save above 4 lines of commented code to use for reference on a later feature
        return(journey.ages[i])
      }
    };
  }
};

export const isSmartStartUrl = (activeQuestData) => {
  return activeQuestData.startUrl && typeof activeQuestData.startUrl !== 'string' && activeQuestData.startUrl.questId && activeQuestData.startUrl.questionId && activeQuestData.startUrl.fallbackUrl; 
}

export const getQuestUrl = (activeQuestData, journey) => {
  if (typeof activeQuestData.startUrl === 'string') {
    return activeQuestData.lastUrl || activeQuestData.startUrl;
  }
  else if (isSmartStartUrl(activeQuestData)) {
    let targetQuestData = journey.quests[activeQuestData.startUrl.questId];

    if (targetQuestData && targetQuestData.quiz && targetQuestData.quiz.results) {
      return targetQuestData.quiz.results[activeQuestData.startUrl.questionId] || activeQuestData.startUrl.fallbackUrl;
    }
    else {
      console.error('Can not find related quest & question', activeQuestData.startUrl, questData);
    }

    // If anything else fails, go to the fallback url
    return activeQuestData.startUrl.fallbackUrl;
  }
  else {
    console.error('Incomplete startUrl', activeQuestData.startUrl);
    return null;
  }
}