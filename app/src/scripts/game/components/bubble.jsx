/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentTab, startQuest, updateQuestUrl, unselectQuest, toggleBubble, selectQuest, changeQuestProgress, openEmbeddedQuest, } from '../../../actions/index';
import { getActiveQuestData, getAreaIconUrl, questUnlocked, getRomanAge, getAge, questTypes, getActivePlayerData } from '../../_utils';


import Pin from './pin';
import Markdown from './markdown';
import Quiz from './quiz';

class Bubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showPrerequisites: false,
      showWhatsNext: true,
    }
  }

  componentDidMount() {
    this.props.getCurrentTab();

    window.addEventListener('focus', this.props.getCurrentTab);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loading === true && !this.props.embeddedPage.open && this.props.activeQuestData && this.props.activeQuestData.type !== questTypes.WEBSITE) {
      this.setState({
        loading: false,
      });
    }
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

    this.setState({
      loading: true,
    });

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
    return this.props.activeQuestData.startUrl && typeof this.props.activeQuestData.startUrl !== 'string' && this.props.activeQuestData.startUrl.questId && this.props.activeQuestData.startUrl.questionId && this.props.activeQuestData.startUrl.fallbackUrl; 
  }

  getQuestHint() {
    if (this.isSmartStartUrl()) {
      let questData = this.props.journey.quests[this.props.activeQuestData.startUrl.questId];

      if (questData && questData.quiz && questData.quiz.questions) {
        for (let question of questData.quiz.questions) {
          if (question.id === this.props.activeQuestData.startUrl.questionId) {
            //  to <strong>{ question.name }</strong>
            return <span>This quest is redirecting you to the URL from this quest's quiz: <a onClick={() => { this.openQuest(questData.id); }} className="questLink">{ questData.name }</a></span>
          }
        }

        console.error('Question not found in quest', this.props.activeQuestData.startUrl, questData);
      }
      else {
        console.error('Invalid Quest Id for smart start url', this.props.activeQuestData.startUrl, questData);
      }
    }
    else {
      return <span className="">👍 Quest is available to start</span>;
    }
  }

  needsLoader() {
    // this.props.embeddedPage.open to trigger rerendering and removing the loader
    return (this.state.loading && this.props.embeddedPage && (this.props.embeddedPage.open || !this.props.embeddedPage.open));
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

  renderPrerequisites() {
    if (this.state.showPrerequisites) {
      return <div className="questList">
        { this.renderPinsList(this.props.activeQuestData.prerequisites) }
        
        <div className="collapse" onClick={() => { this.setState({ showPrerequisites: false }) }}>Hide Prerequisites</div>
      </div>
    }
    else {
      return <div className="expand" onClick={() => { this.setState({ showPrerequisites: true }) }}>Show Prerequisites</div>
    }
  }

  renderWhatsNext() {
    if (this.props.activeQuestData.following && this.props.activeQuestData.following.length) {
      if (this.state.showWhatsNext) {
        return <div className="questList bordered">
          { this.renderPinsList(this.props.activeQuestData.following) }

          <div className="collapse" onClick={() => { this.setState({ showWhatsNext: false }) }}>Hide What's Next</div>
        </div>
      }
      else {
        return <div className="expand" onClick={() => { this.setState({ showWhatsNext: true }) }}>Show What's Next</div>
      }
    }
  }

  renderActions() {
    if (!questUnlocked(this.props.activeQuestData, this.props.journey)) {
      return <div className="actions">
        <button className="disabled">
          LOCKED
        </button>
        { this.renderPrerequisites() }
      </div>
    }
    else if (this.props.activeQuestData.status === 'inProgress') {
      return <div className="actions">
        <button
          className={ `inProgress ${ (this.needsLoader()) ? 'loader' : ''}` }
          onClick={ () => { this.startQuestBt() } }>
          { (!this.needsLoader()) ? 'Continue the quest' : '' }
        </button>
        <div className="questHint">
          🚀 You were on a great start!
        </div>
      </div>
    }
    else if (this.props.activeQuestData.status === 'complete') {
      return <div className="actions">
        <div className="checkmark">Congrats! You've completed this quest. 😎</div>
        {/* { this.renderQuizResults() } */}
        <div className="finishedActionsWrapper">
          { (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.EMBEDDED) ? <div
            className="view"
            onClick={ () => { this.startQuestBt(0) } }>
            View Quest
          </div> : '' }
          <div
            className="restart"
            onClick={ () => { 
              if (confirm(`Are you sure you want to restart the quest "${ this.props.activeQuestData.name }"?`)) { 
                this.props.changeQuestProgress(this.props.activeQuest.quest, 'none');
              }
            } }>
            Restart Quest
          </div>
        </div>
        
        { this.renderWhatsNext() }
      </div>
    }
    // If the quest is new and available to start (default)
    else {
      return <div className="actions">
        <button
          className={ `new ${ (this.needsLoader()) ? 'loader' : ''}` }
          onClick={ () => { this.startQuestBt() } }>
          { (!this.needsLoader()) ? this.props.activeQuestData.CTA || 'Get Started!' : '' }
        </button>
        <div className="questHint">
          { this.getQuestHint() }
        </div>
        
      </div>
    }
  }

  getContent() {
    return <div
      className="bubble-description"
      style={ {
        maxHeight: window.innerHeight-50-50-100
      }}
    >

      <div className="text-description">
        <Markdown mdContent={this.props.activeQuestData.content} />
      </div>
        
      { this.renderActions() }
    </div>;
  }

  aomLogo() {
    if (!this.props.embed) {
      return <div>
        <span className="moonFlowerFont">AGE OF </span><span className="makerFont"> MAKERS</span>
      </div>
    }
    else {
      return <img src={ chrome.extension.getURL("images/ageofmaker_name.png") } />
    }
  }

  render() {
    // Quest data needed and in the right tab if in embed mode
    if (this.props.activeQuestData
    && ( ! this.props.embed
      || ( this.props.currentTab && this.props.activeQuest.tab === this.props.currentTab.id )
    ) ) {
      return (
        <nav className={`aom-bubble ${(this.props.bubbleToggled) ? '' : 'bubbleClosed'}`}>
          <div
            className={`box-header`}
            onClick={() => this.props.toggleBubble(this.props.bubbleToggled)}>
            <div className={`box-icon`} style={ { 'backgroundImage': `url('${getAreaIconUrl(this.props.activeQuestData, this.props.journey, true)}')`} }></div>
            <label htmlFor="acc-close" className="box-title">{this.props.activeQuestData.name}</label>
          </div>
          
          <div className="boxAccordionWrapper">
            { this.props.children || this.getContent() }
          </div>
          
          <div
            className={`box-footer`}
            onClick={() => this.props.toggleBubble(this.props.bubbleToggled)}>

            <div
              className="exit-btn"
              onClick={() =>  {
                // Keep the actual url, if returning on the map from a quest
                if (this.props.embed) {
                  this.props.updateQuestUrl(this.props.journey.quests, this.props.activeQuest.quest, window.location.href);
                }
                this.props.unselectQuest((this.props.embed) ? this.props.currentTab : null);
              } } ></div>

            <label htmlFor="acc-close" className="box-title">
              { this.aomLogo() }
            </label>
            <div className="close"></div>
          </div>
        </nav>
      );
    }
    else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    bubbleToggled: state.bubbleToggled,
    currentTab: state.currentTab,
    sid: state.sid,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    embeddedPage: state.embeddedPage,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    players: state.players,
    journey: state.journey,
    currentTab: state.currentTab,
    walkthrough: state.walkthrough,
    showcase: state.showcase,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getCurrentTab, startQuest, updateQuestUrl, unselectQuest, selectQuest, toggleBubble, changeQuestProgress, openEmbeddedQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Bubble);
