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
import { questUnlocked, agesData, getRomanAge, getAge, questTypes } from '../../_utils';
import { mdRenderers } from '../../_reactUtils';
import { reloadQuests, selectQuest, startQuest, toggleBubble, getActivePlayer, stopWalkthrough, getOnboarding, openWelcome, setOnboarding, changeStage, startWalkthrough, openEmbeddedQuest } from '../../../actions/index';

import Pin from './pin';
import Header from './header';
import Bubble from './bubble';
import EmbeddedQuest from './embeddedQuest';
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
    if (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.WEBSITE) {
      this.props.startQuest(this.props.activeQuest.quest, this.props.currentTab.id);
      window.location = this.props.activeQuestData.lastUrl || this.props.activeQuestData.startUrl;
    }
    else if (this.props.activeQuestData && (this.props.activeQuestData.type === questTypes.SHOWCASE || this.props.activeQuestData.type === questTypes.KANBAN)) {
      this.props.openEmbeddedQuest();
    }
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
          { this.props.activeQuestData.CTA || 'Get Started!' }
        </button>
    }
  }

  renderPinsList(pins) {
    if (pins && pins.length) {
      return <div>
        {pins.map((pin) => {
          // If the pin is actually an Age requirements!
          if (pin.age) {
            let agePrereq = agesData[pin.age];
            let currentAge = getAge(this.props.quests);
            
            return <div className="prereqWrapper">
                <div className={ `agePrereq ${(currentAge.index < agePrereq.index) ? 'locked' : 'complete'}` }>
                  { getRomanAge(agePrereq.index) }
                </div>
                <div
                  className="questName">
                  Age { agePrereq.index + 1 } required: Age of { agePrereq.name }.
                </div>
              </div>
          }
          else {
            let questNeeded = this.props.quests[pin];
            return <div className="prereqWrapper"
                  onClick={() => this.openQuest(pin)}>
                <Pin quest={questNeeded} embedded={true} />
                <div
                  className="questName">
                  {questNeeded.name}
                </div>
              </div>
          }
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
        <div className="title">To unlock this quest, you need:</div>
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
          <EmbeddedQuest />
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
    showcase: state.showcase,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ reloadQuests, selectQuest, startQuest, toggleBubble, getActivePlayer, stopWalkthrough, openWelcome, getOnboarding, setOnboarding, changeStage, startWalkthrough, openEmbeddedQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
