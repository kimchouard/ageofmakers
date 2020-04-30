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

export const questUnlocked = (quest, quests) => {
  if (quest && quest.prerequisites === []) {
    return true; // no prerequisites
  }
  else if (quest) {
    for(let i = 0; i < quest.prerequisites.length; i++) {
      let questNeeded = quests[quest.prerequisites[i]];
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

export const agesData = [
  {
    index: 0,
    name: "Exploration",
    image: null,
    requirements: {
      Coding: 1,
      Electronics: 1,
      ThreeD: 1
    }
  },
  {
    index: 1,
    name: "Discovery",
    image: null,
    requirements: {
      total: 5
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
    let newArray = Object.keys(agesData[i].requirements).map( (valleyName) => {
      if (valleyName === "total") {
        if (typeof(agesData[i].requirements[valleyName]) === "string" && addComplete(quests, null, null) === addComplete(quests)){
          return "all";
        } else {
          return addComplete(quests);
        }
      } else {
        if (typeof(agesData[i].requirements[valleyName]) === "string" && addComplete(quests, valleyName, null) === addComplete(quests, valleyName)){
          return "all";
        } else {
          return addComplete(quests, valleyName)
        }
      }
    });
    if ( (newArray >= Object.values(agesData[i].requirements) && Object.values(agesData[i].requirements) !== -1) || newArray === Object.values(agesData[i].requirements)) {
      // console.log("Passed Age:", agesData[i].name)
      if (agesData[i].index + 1 === agesData.length) {
        // console.log("Returned Final Index!!!:", agesData[i].index)
        return(agesData[i])
      }
    } else {
      // console.log("Failed Age:", agesData[i].name)
      // console.log("Returned Index:", agesData[i].index) Save above 4 lines of commented code to use for reference on a later feature
      return(agesData[i])
      i = agesData.length
    }
  };
};