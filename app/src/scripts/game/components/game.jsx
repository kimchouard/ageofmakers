/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { questUnlocked, getRomanAge, getAge, questTypes, isLoggedInAndLoaded, isNewAge, getActivePlayerData, getActiveQuestData } from '../../_utils';
import { reloadQuests, selectQuest, startQuest, toggleBubble, getActivePlayer, stopWalkthrough, setPlayerOnboarding, changeQuestProgress, startWalkthrough, openEmbeddedQuest } from '../../../actions/index';

import Pin from './pin';
import Header from './header';
import Bubble from './bubble';
import EmbeddedPage from './embeddedPage';
import Walkthrough from './walkthrough';
import Onboarding from './onboarding';
import Celebration from './celebration';
import LeafletMap from './leafletMap';
import AgeTree from './ageTree';
import Markdown from './markdown';
import Quiz from './quiz';
import AnalyticsProvider from './analyticsProvider';

class Game extends Component {
  constructor(props) {
    super(props);
  }

  openQuest(questKey) {
    this.props.toggleBubble(false);
    this.props.selectQuest(questKey);
  }

  startQuestBt(viewOrderId) {
    // TODO: Send events to Google Analytics
    // ga('send', {
    //   hitType: 'event',
    //   eventCategory: 'Quest',
    //   eventAction: 'start',
    //   eventLabel: this.props.activeQuestData.id,
    //   hitCallback: () => {
    //     console.log('Event sent to Google Analytics!');
    //   }
    // });
    // _gaq.push(['_trackEvent', 'Quest', 'start']);

    if (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.WEBSITE) {
      this.props.startQuest(this.props.activeQuest.quest, this.props.currentTab.id);

      if (typeof this.props.activeQuestData.startUrl === 'string') {
        return window.location = this.props.activeQuestData.lastUrl || this.props.activeQuestData.startUrl;
      }
      else if (this.isSmartStartUrl()) {
        let questData = this.props.journey.quests[this.props.activeQuestData.startUrl.questId];

        if (questData && questData.quiz && questData.quiz.results) {
          return window.location = questData.quiz.results[this.props.activeQuestData.startUrl.questionId] || this.props.activeQuestData.startUrl.fallbackUrl;
        }
        else {
          console.error('Can not find related quest & question', this.props.activeQuestData.startUrl, questData);
        }

        // If anything else fails, go to the fallback url
        return window.location = this.props.activeQuestData.startUrl.fallbackUrl;
      }
      else {
        console.error('Incomplete startUrl', this.props.activeQuestData.startUrl);
      }
    }
    else if (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.EMBEDDED) {
      // If defined, set the view order id as we open the quest
      this.props.openEmbeddedQuest(viewOrderId);
    }
  }

  renderQuizResults() {
    if (this.props.activeQuestData.quiz && this.props.activeQuestData.quiz.results) {
      return <div>
        <hr/>
        <h5>Your Quiz Answers</h5>
        <Quiz 
          quizData={this.props.activeQuestData.quiz}
          inline={true}
          editable={true} 
          saveQuiz={(questions) => { this.props.changeQuestProgress(this.props.activeQuest.quest, null, null, questions); } } />
      </div>
    }
  }

  isSmartStartUrl() {
    return this.props.activeQuestData.startUrl && this.props.activeQuestData.startUrl.questId && this.props.activeQuestData.startUrl.questionId && this.props.activeQuestData.startUrl.fallbackUrl;
  }

  getSmartStartUrlHint() {
    if (this.isSmartStartUrl()) {
      let questData = this.props.journey.quests[this.props.activeQuestData.startUrl.questId];

      if (questData && questData.quiz && questData.quiz.questions) {
        for (let question of questData.quiz.questions) {
          if (question.id === this.props.activeQuestData.startUrl.questionId) {
            return <div className="startUrlHint">
              <small>You will be redirected to the link you answered to <strong>{ question.name }</strong> from the <a onClick={() => { this.openQuest(questData.id); }} className="questLink">{ questData.name }</a> quest</small>
            </div>
          }
        }

        console.error('Question not found in quest', this.props.activeQuestData.startUrl, questData);
      }
      else {
        console.error('Invalid Quest Id for smart start url', this.props.activeQuestData.startUrl, questData);
      }
    }
    else {
      console.error('Invalid smarl start url', this.props.activeQuestData.startUrl);
    }
  }

  startButton() {
    if (!questUnlocked(this.props.activeQuestData, this.props.journey)) {
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
      return <div>
        { this.renderQuizResults() }
        { (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.EMBEDDED) ? <button
          className="view"
          onClick={ () => { this.startQuestBt(0) } }>
          View the Quest
        </button> : '' }
        <button
          className="restart"
          onClick={ () => { 
            if (confirm(`Are you sure you want to restart the quest "${ this.props.activeQuestData.name }"?`)) { 
              this.props.changeQuestProgress(this.props.activeQuest.quest, 'none');
            }
          } }>
          Restart the quest
        </button>
      </div>
    }
    else {
      return <div>
        <button
          className="new"
          onClick={ () => { this.startQuestBt() } }>
          { this.props.activeQuestData.CTA || 'Get Started!' }
        </button>
        { (typeof this.props.activeQuestData.startUrl !== 'string') ? this.getSmartStartUrlHint() : ''}
      </div>
    }
  }

  renderPinsList(pins) {
    if (pins && pins.length) {
      return <div>
        {pins.map((pin) => {
          // If the pin is actually an Age requirements!
          if (pin.age) {
            let agePrereq = this.props.journey.ages[pin.age];
            let currentAge = getAge(this.props.journey);
            
            return <div className="prereqWrapper" key={pin.id}>
                <div className={ `agePrereq ${(currentAge.index < agePrereq.index) ? 'locked' : 'complete'}` }>
                  { getRomanAge(agePrereq) }
                </div>
                <div
                  className="questName">
                  Age { agePrereq.index + 1 } required: Age of { agePrereq.name }.
                </div>
              </div>
          }
          else {
            let questNeeded = this.props.journey.quests[pin];
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
    if (questUnlocked(this.props.activeQuestData, this.props.journey) && this.props.activeQuestData.status === 'complete') {
      return <div className="cta next">
        <div className="title">Done! { (this.props.activeQuestData.following && this.props.activeQuestData.following.length) ? `So, what's next?` : `Good job.` } </div>
        { this.renderPinsList(this.props.activeQuestData.following) }
      </div>
    }
  }

  renderPrerequesites() {
    if (!questUnlocked(this.props.activeQuestData, this.props.journey)) {
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

      <Markdown mdContent={this.props.activeQuestData.content} />

      <div className="action">
        { this.startButton() }
      </div>

      { this.renderPrerequesites() }
    </div>;
  }

  render() {
    require('../../../sass/game.scss');

    return (
      <div className={`gameWrapper ${ (!isLoggedInAndLoaded(this.props) || isNewAge(this.props.activePlayerData,this.props.journey)) ? 'blurry' : ''}`}>
        <Header />
        <LeafletMap />
        <EmbeddedPage />
        <Onboarding />
        <Celebration />
        <AgeTree />
        { (this.props.activeQuest) ? <Bubble embed={false}>{ this.getContent() }</Bubble> : null }
        { (isLoggedInAndLoaded(this.props)) ? <Walkthrough/> : null }
        <AnalyticsProvider />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sid: state.sid,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    players: state.players,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    journey: state.journey,
    currentTab: state.currentTab,
    walkthrough: state.walkthrough,
    showcase: state.showcase,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ reloadQuests, selectQuest, startQuest, toggleBubble, getActivePlayer, stopWalkthrough, changeQuestProgress, startWalkthrough, openEmbeddedQuest, setPlayerOnboarding, }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
