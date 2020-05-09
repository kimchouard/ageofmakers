/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export const stageStatus = {
  STATUS_COMPLETE: 'complete',
  STATUS_INPROGRESS: 'inProgress',
  STATUS_NEW: 'new',
};

export const questTypes = {
  WEBSITE: 'website',
  SHOWCASE: 'showcase',
  KANBAN: 'kanban',
};

export const questUnlocked = (quest, quests) => {
  if (quest && quest.prerequisites === []) {
    return true; // no prerequisites
  }
  else if (quest) {
    for(let i = 0; i < quest.prerequisites.length; i++) {
      let questPreReq = quest.prerequisites[i];

      if (questPreReq.age) {
        let currentAge = getAge(quests);
        if (currentAge.index < questPreReq.age) {
          return false;
        }
      }
      else {
        let questNeeded = quests[questPreReq];
        if (questNeeded) {

          if (!questUnlocked(questNeeded, quests)) {
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
    console.error('Invalid quest passsed for questUnlock(...)', quest, quests);
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

export const getRomanAge = (ageIndex) => {
  if(ageIndex === 0) { return "I"; }
  else if(ageIndex === 1) { return "II"; }
  else if(ageIndex === 2) { return "III"; }
  else if(ageIndex === 3) { return "IV"; }
  else if(ageIndex === 4) { return "V" }
  else { return "" }
}

export const agesData = [
  {
    index: 0,
    name: "Discovery",
    image: null,
    requirements: {
      MakerMount: 1
    }
  },
  {
    index: 1,
    name: "Exploration",
    image: null,
    requirements: {
      Coding: 1,
      Electronics: 1,
      ThreeD: 1,
      total: 8
    }
  },
  {
    index: 2,
    name: "Making",
    image: null,
    requirements: {
      MakerMount: "all"
    }
  },
  {
    index: 3,
    name: "Sharing",
    image: null,
    requirements: {
      total: 'all'
    }
  },
  {
    index: 4,
    name: "Independent",
    image: null,
    requirements: {}
  }
];

export const getAge = (quests) => {
  for (let i = 0; i < agesData.length; i++) {
    let currentReqs = agesData[i].requirements;
    let currentValues = Object.keys(currentReqs).map( (valleyName) => {
      if (valleyName === "total") {
        if (typeof(currentReqs[valleyName]) === "string" && addComplete(quests, null, null) === addComplete(quests)){
          return "all";
        } else {
          return addComplete(quests);
        }
      } else {
        if (typeof(currentReqs[valleyName]) === "string" && addComplete(quests, valleyName, null) === addComplete(quests, valleyName)){
          return "all";
        } else {
          return addComplete(quests, valleyName)
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
      console.log("Passed Age:", agesData[i].name)
      if (agesData[i].index + 1 === agesData.length) {
        // console.log("Returned Final Index!!!:", agesData[i].index)
        return(agesData[i])
      }
    } else {
      // console.log("Failed Age:", agesData[i].name)
      // console.log("Returned Index:", agesData[i].index) Save above 4 lines of commented code to use for reference on a later feature
      return(agesData[i])
    }
  };
};