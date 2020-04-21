/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS } from 'react-joyride/lib/constants.js';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {stopWalkthrough, openProfile, toggleBubble, selectQuest, closeProfile, setOnboarding } from '../../../actions/index';

class Walkthrough extends Component {
    constructor(props) {
      super(props);
      this.state = {
        steps: [],
        stepIndex: 0
      }
    }

    walkthroughCb(action,index,type,tour) {
      if (action === ACTIONS.STOP || action === ACTIONS.CLOSE || type === EVENTS.TOUR_END) {
        this.props.stopWalkthrough();
        this.setState({stepIndex: 0});
        this.props.setOnboarding(true)
      } else if (action === ACTIONS.START) {
          this.props.closeProfile();
          this.setWalkthrough()
      } else if (type === EVENTS.STEP_AFTER) {
        if (this.props.walkthrough.start === 1) {
          if (index === 6) {
            this.props.toggleBubble(false);
            this.props.selectQuest('a004100000qR83OAAS');
            setTimeout(() => {
              this.setState({stepIndex: this.state.stepIndex + 1});
            }, 500);
          } else {
            this.setState({stepIndex: this.state.stepIndex + 1});
          }
        } else if (this.props.walkthrough.start === 2) {
          if (index === 0) {
            this.props.openProfile()
            this.setState({stepIndex: this.state.stepIndex + 1});
          } else if (index === 7) {
            this.props.closeProfile()
            this.setState({stepIndex: this.state.stepIndex + 1});
          } else {
            this.setState({stepIndex: this.state.stepIndex + 1});
          }
        } else if (this.props.walkthrough.start === 3) {
          if (index === 2) {
            this.props.toggleBubble(false);
            this.props.selectQuest('a004100000qR83OAAS');
            setTimeout(() => {
              this.setState({stepIndex: this.state.stepIndex + 1});
            }, 400);
          } else {
            this.setState({stepIndex: this.state.stepIndex + 1});
          }
        }
      }
    }

    setWalkthrough() {
      const stepStyles = {
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
      if (this.props.walkthrough.start === 1) {
        this.setState({steps: [
          {
            content: <div><h3>Welcome to<br/> the Age of Makers!</h3><p>In this game, you're on an adventure where you'll complete quests about 3D printing, coding and electronics. 🏆</p><p>Ultimately, you'll be able to create your dream object 🚀😎</p><p>So let's get started!</p></div>,
            placement: "center",
            styles: stepStyles,
            disableBeacon: true,
            target: "body"
          },
          {
            content: <div>
            <p>This is a pin, which represents a quest.<br />A quest is either:</p>
            <ul style={ { 'text-center': 'left' } }>
              <li>gray if locked,</li>
              <li>red if ready to be tackled,</li>
              <li>orange if you're working on it</li>
              <li>and green for complete!</li>
            </ul>
            <p>You can access the quest via this pins. They are placed in 4 valleys, based on the skills you'll learn with it. 👨‍💻</p>
            </div>,
            placement: "right",
            styles: stepStyles,
            disableBeacon: true,
            target: ".a004100000qR83OAAS"
          },
          {
            content: <p>👀 Up here is the header, which tracks two things...</p>,
            placementBeacon: "top",
            placement: "bottom",
            styles: stepStyles,
            disableBeacon: true,
            target: ".controls"
          },
          {
            content: <p>It shows the number of quests you completed... 💪</p>,
            placementBeacon: "top",
            placement: "bottom",
            styles: stepStyles,
            disableBeacon: true,
            target: ".badgeTrackersHeader"
          },
          {
            content: <p>...and the account you are currently logged in with. ☝️</p>,
            placementBeacon: "left",
            placement: "bottom-left",
            styles: stepStyles,
            target: ".user"
          },
          {
            content: <p>You can also access you profile page via your tent. ⛺️</p>,
            placement: "right",
            styles: stepStyles,
            disableBeacon: true,
            target: ".tent"
          },
          {
            content: <p>But enough with the boring stuff, let's actually start the quest! Start by clicking the pin, then hit next.</p>,
            placement: "right",
            styles: stepStyles,
            disableBeacon: true,
            spotlightClicks: true,
            target: ".a004100000qR83OAAS"
          },
          {
            content: <p>This is the quest bubble, it shows information for a quest like...</p>,
            placementBeacon: "top",
            placement: "left",
            styles: stepStyles,
            disableBeacon: true,
            target: ".aom-bubble"
          },
          {
            content: <p>The title of the quest...</p>,
            placementBeacon: "top",
            placement: "left",
            styles: stepStyles,
            disableBeacon: true,
            target: ".box-title"
          },
          {
            content: <p>...and a description of the quest.</p>,
            placementBeacon: "top",
            placement: "left",
            styles: stepStyles,
            disableBeacon: true,
            target: ".bubble-description div"
          },
          {
              content: <p>Now it's all up to you! Click the "Get Started" button and complete your first quest by following the steps. 🚀</p>,
              placementBeacon: "top",
              placement: "left",
              styles: stepStyles,
              spotlightClicks: true,
              disableBeacon: true,
              target: ".bubble-description .action"
          },
          {
            content: <p>Or... You can click here to view this and other tutorials at any time. 🙃</p>,
            placement: "right",
            styles: stepStyles,
            disableBeacon: true,
            target: ".help"
          },
        ]})
      } else if (this.props.walkthrough.start === 2) {
        this.setState({
          steps: [
            {
              content: <p>Let's take a closer look at the tent shall we. 👀 Start off by clicking next!</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: true,
              target: ".tent"
            },
            {
              content: <p>Welcome to your profile page! 🎉 Here you can get lots of info like...</p>,
              placement: "center",
              styles: stepStyles,
              disableBeacon: false,
              target: ".wrapper"
            },
            {
              content: <p>your profile name with a nice greeting 😌</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".profileName"
            },
            {
              content: <p>the number quests you have beaten so far 💪🏻</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".questsBeat"
            },
            {
              content: <p>and the badges for quests you have completed!</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".codingBadges"
            },
            {
              content: <p>Note that badges that are up next are grayed-out. As you complete a quest's task, they will gain color and track progress through a progress bar..</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".content"
            },
            {
              content: <p>The badges are sorted by valley, so find your favorite one and click it to open up the quest correlated to that badge.</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".codingName"
            },
            {
              content: <p>Click this back button when you want to return back to the map.</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".closingbutton"
            },
            {
              content: <p>If you ever want to go to the profile page again, just click your tent. ⛺️</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: false,
              target: ".tent"
            },
            
          ]
        })
      } else if (this.props.walkthrough.start === 3) {
        this.setState({
          steps: [
            {
              content: <p>Ready for the adventure?? Let's go through the process of completing your first quest! 🏆</p>,
              placement: "center",
              styles: stepStyles,
              disableBeacon: true,
              target: ".leaflet-container"
            },
            {
              content: <div>
                  <p>This is a pin, which represents a quest.<br />A quest is either:</p>
                  <ul style={ { 'text-center': 'left' } }>
                    <li>gray if locked,</li>
                    <li>red if ready to be tackled,</li>
                    <li>orange if you're working on it</li>
                    <li>and green for complete!</li>
                  </ul>
                </div>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: true,
              target: ".a004100000qR83OAAS"
            },
            {
              content: <p>But enough with the boring stuff, let's actually start the quest!</p>,
              placement: "right",
              styles: stepStyles,
              disableBeacon: true,
              spotlightClicks: true,
              target: ".a004100000qR83OAAS"
            },
            {
              content: <p>This is the quest bubble, it shows information for a quest like...</p>,
              placementBeacon: "top",
              placement: "left",
              styles: stepStyles,
              disableBeacon: true,
              target: ".aom-bubble"
            },
            {
              content: <p>The title of the quest...</p>,
              placementBeacon: "top",
              placement: "left",
              styles: stepStyles,
              disableBeacon: true,
              target: ".box-title"
            },
            {
              content: <p>...and a description of the quest.</p>,
              placementBeacon: "top",
              placement: "left",
              styles: stepStyles,
              disableBeacon: true,
              target: ".bubble-description div"
            },
            {
                content: <p>Now it's all up to you! Click the "Get Started" button and complete your first quest by following the steps. 🚀</p>,
                placementBeacon: "top",
                placement: "left",
                styles: stepStyles,
              spotlightClicks: true,
              disableBeacon: true,
              target: ".bubble-description .action"
            },
          ],
        })
      }
    }

    render() {
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
}


const mapStateToProps = (state) => {
  return {
    walkthrough: state.walkthrough,
  };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({stopWalkthrough, openProfile, toggleBubble, selectQuest, closeProfile, setOnboarding}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);