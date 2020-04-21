/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactMarkdown from 'react-markdown';
import { questUnlocked, apiUrl } from '../../_utils';
import { mdRenderers } from '../../_reactUtils';
import { reloadQuests, selectQuest, startQuest, toggleBubble, getActivePlayer, stopWalkthrough, getOnboarding, openWelcome, setOnboarding, changeStage, startWalkthrough } from '../../../actions/index';

import Pin from './pin';
import Header from './header';
import Bubble from './bubble';
import Profile from './profile';
import Walkthrough from './walkthrough';
import Welcome from './welcome';
import LeafletMap from './leafletMap';
import AgeTree from './ageTree';

class Game extends Component {
  constructor(props) {
    super(props);
    if (!this.props.quests) {
      this.props.reloadQuests();
    }
    else if (!this.props.activeQuest) {
      this.props.reloadQuests();
    }
  }

  openQuest(questKey) {
    this.props.toggleBubble(false);
    this.props.selectQuest(questKey);
  }

  startQuestBt() {
    this.props.startQuest(this.props.activeQuest.quest, this.props.currentTab.id);
    window.location = this.props.activeQuestData.lastUrl || this.props.activeQuestData.startUrl;
  }

  startButton() {
    if (!questUnlocked(this.props.activeQuestData, this.props.quests)) {
      return <button className="disabled">
          LOCKED
        </button>
    }
    if (this.props.activeQuestData.status === 'inProgress') {
      return <button
        className="inProgress"
        onClick={ () => { this.startQuestBt() } }>
          Continue the quest
        </button>
    }
    else if (this.props.activeQuestData.status === 'complete') {
      return <button
        className="complete"
        onClick={ () => { this.props.changeStage(this.props.activeQuest.quest, 'none') } }>
          Restart the quest
        </button>
    }
    else {
      return <button
        className="new"
        onClick={ () => { this.startQuestBt() } }>
          Get Started!
        </button>
    }
  }

  renderPinsList(pins) {
    if (pins && pins.length) {
      return <div>
        {pins.map((pin) => {
          let questNeeded = this.props.quests[pin];
          return <div className="prereqWrapper"
                onClick={() => this.openQuest(pin)}>
              <Pin quest={questNeeded} embedded={true} />
              <div
                className="questName">
                {questNeeded.name}
              </div>
            </div>
        })}
      </div>
    }
  }

  renderWhatsNext() {
    if (questUnlocked(this.props.activeQuestData, this.props.quests) && this.props.activeQuestData.status === 'complete') {
      return <div className="cta next">
        <div className="title">Done! { (this.props.activeQuestData.following.length) ? `So, what's next?` : `Good job.` } </div>
        { this.renderPinsList(this.props.activeQuestData.following) }
      </div>
    }
  }

  renderPrerequesites() {
    if (!questUnlocked(this.props.activeQuestData, this.props.quests)) {
      return <div className="cta before">
        <div className="title">Before, you need to complete:</div>
        { this.renderPinsList(this.props.activeQuestData.prerequisites) }
      </div>
    }
  }

  getContent() {
  return <div
      className="bubble-description"
    >
      { this.renderWhatsNext() }

      <ReactMarkdown
        source={this.props.activeQuestData.content}
        renderers={ mdRenderers }
      />

      <div className="action">
        { this.startButton() }
      </div>

      { this.renderPrerequesites() }
    </div>;
  }

  render() {
    if (this.props.quests && !this.props.quests.error) {
      require('../../../sass/game.scss');

      this.props.getOnboarding();
      if (this.props.onboarding === false || this.props.onboarding === undefined) {
        this.props.startWalkthrough(1);
        this.props.setOnboarding(true)
      }
      return (
        <div className="gameWrapper">
          <Header />
          <LeafletMap />
          {/* <Profile /> */}
          <Welcome />
          <AgeTree />
          { (this.props.activeQuest) ? <Bubble embed={false}>{ this.getContent() }</Bubble> : null }
          { (this.props.walkthrough.start) ? <Walkthrough/> : null }
        </div>
      );
    }
    else {
      return <div></div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    sid: state.sid,
    activePlayer: state.activePlayer,
    activeQuest: state.activeQuest,
    activeQuestData: (state.activeQuest) ? state.quests[state.activeQuest.quest] : null,
    quests: state.quests,
    currentTab: state.currentTab,
    walkthrough: state.walkthrough,
    onboarding: state.isOnboarded,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ reloadQuests, selectQuest, startQuest, toggleBubble, getActivePlayer, stopWalkthrough, openWelcome, getOnboarding, setOnboarding, changeStage, startWalkthrough }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
