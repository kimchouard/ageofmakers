/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS } from 'react-joyride/lib/index.js';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { isLoggedInAndLoaded, getActivePlayerData, getAge, isNewAge, isOutdatedAge } from '../../_utils';
import {stopWalkthrough, startWalkthrough, toggleBubble, selectQuest, setPlayerOnboarding, changeAge, } from '../../../actions/index';
import Markdown from './markdown';
import yaml from 'js-yaml';

class Walkthrough extends Component {
    constructor(props) {
      super(props);
      this.state = {
        steps: [],
        stepIndex: 0,
        demoQuest: 'welcome_quest',
        stepDefaultStyles: {
          options: {
            zIndex: 10000,
          },
          buttonNext: {
            borderRadius: 4,
            position: 'absolute',
            left: '43%',
            bottom: '5%',
            textAlign:'center',
            color: 'white',
            background: '#FF5335',
          },
          floater: {
            arrow : {
                display: "none"
            }
          }  
        }
      }
    }

    // componentDidMount() {
    //   // If the game is loaded, and that the player hasn't been onboarded, start the walkthrough, if not started already.
    //   if (isLoggedInAndLoaded(this.props) && this.props.activePlayerData && !this.props.walkthrough.start && (this.props.activePlayerData.onboarded === false || this.props.activePlayerData.onboarded === undefined)) {
    //     this.props.startWalkthrough(1);
    //     // this.props.setPlayerOnboarding(true);
    //   }
    // }

    walkthroughCb(action,index,type,tour) {
      // When walkthrough starts
      if (action === ACTIONS.START) {
          if (isNewAge(this.props.activePlayerData,this.props.journey)) {
            let currentAge = getAge(this.props.journey);
            console.log('Current age:', currentAge);
            if (currentAge.walkthrough) {
              this.setWalkthroughSteps(currentAge.walkthrough);
            }
            else {
              console.error('Current age does not have a walkthrough. Skipping it.', currentAge);
              this.props.changeAge(currentAge.index);
            }
          }
          else if (this.props.walkthrough.name) {
            this.setDefaultWalkthrough(this.props.walkthrough.name);
          }
      // When walkthrough goes to next step
      } else if (type === EVENTS.STEP_AFTER) {
        let currentStep = this.state.steps[this.state.stepIndex];

        if (currentStep.openQuest) {
          this.props.toggleBubble(false);
          this.props.selectQuest(currentStep.openQuest);
          setTimeout(() => {
            this.setState({stepIndex: this.state.stepIndex + 1});
          }, 500);
        } else {
          this.setState({stepIndex: this.state.stepIndex + 1});
        }
      }
      // When walkthrough stops
      else if (action === ACTIONS.STOP || action === ACTIONS.CLOSE || type === EVENTS.TOUR_END) {
        this.setState({steps: [], stepIndex: 0});
        
        if (isNewAge(this.props.activePlayerData,this.props.journey)) {
          // Set the age in the user profile
          this.props.changeAge(getAge(this.props.journey).index);
        }
        else {
          this.props.stopWalkthrough();
        }
        // this.props.setPlayerOnboarding(true);
      }
    }

    setWalkthroughSteps(steps) {
      if (steps && steps.length) {
        this.setState({
          // Adding the default styles to each steps
          steps: steps.map((step) => {
            let newStep = step;
            newStep.styles = this.state.stepDefaultStyles;
            newStep.disableBeacon = true;
            newStep.content = (typeof step.content === "string") ? <Markdown mdContent={step.content}/> : step.content;
            return newStep;
          }),
          stepIndex: 0,
        });
      }
      else {
        console.error('Invalid steps, impossible to set it for the walkthrough.', steps);
      }
    }

    setDefaultWalkthrough(walkthroughName) {
      const walkthroughsUrl = chrome.runtime.getURL(`data/walkthroughs.yaml`);
      fetch(walkthroughsUrl)
        .then((walkthroughsResponse) => {
        if (walkthroughsResponse.status !== 200) {
          console.error('Error while loading quests:', res);
          return resolve({ error: walkthroughsResponse.status });
        }

        // Examine the text in the walkthroughsResponse
        walkthroughsResponse.text().then((walkthroughsData) => {
          let walkthroughsArray = yaml.safeLoadAll(walkthroughsData);
          console.log('Yaml data', walkthroughsArray);
          
          if (walkthroughsArray && walkthroughsArray[0]) {
            let steps = walkthroughsArray[0][walkthroughName];
            
            if (steps) {
              this.setWalkthroughSteps(steps);
            }
            else {
              console.error('Error while loading the default walkthrough for', walkthroughName);
            }
          }
        });
    });
    }

    render() {
      if (this.props.walkthrough && this.props.walkthrough.name || isNewAge(this.props.activePlayerData,this.props.journey)) {
        return (
          <Joyride
              run={true}
              steps={this.state.steps}
              stepIndex={this.state.stepIndex}
              debug={true}
              callback={(tour) => {
                const { action, index, type} = tour;
                this.walkthroughCb(action,index,type,tour);
              } }
              hideBackButton={true}
              continuous={true}
          />
        );
      }
      else {
        if (isOutdatedAge(this.props.activePlayerData,this.props.journey)) {
          let userAge = getAge(this.props.journey).index;
          console.log('Age outdated, updated user age', userAge);

          // Set the right age in the user profile
          this.props.changeAge(userAge);
        }

        return <div></div>;
      }
    }
}


const mapStateToProps = (state) => {
  return {
    walkthrough: state.walkthrough,
    journey: state.journey,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    players: state.players,
  };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({stopWalkthrough, startWalkthrough, toggleBubble, selectQuest, setPlayerOnboarding, changeAge, }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);