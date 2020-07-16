/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { isLoggedInAndLoaded, isQuestsLoaded, isLoggedIn, getActivePlayerData, getRomanAge, questTypes, stageTypes, journeyIds } from '../../_utils';
import { getQuests } from '../../../actions/index';
import { bindActionCreators } from 'redux';

import MusicShowcase from './showcaseMusic';
import Kanban from './kanban';
import Video from './video';
import Quiz from './quiz';
import Markdown from './markdown';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = { }
    this.reloadQuestsIfNeeded();
  }
  
  componentDidUpdate() {
    this.reloadQuestsIfNeeded();
  }

  reloadQuestsIfNeeded() {
    if (isLoggedIn(this.props) && !isQuestsLoaded(this.props)) {
      this.props.reloadQuests(this.props.activePlayerData.journey);
    }
  }

  getValleyData(valleyId) {
    if (this.props.journey.areas && this.props.journey.areas[valleyId]) {
      return this.props.journey.areas[valleyId];
    }
    else {
      console.error('No area data!', this.props.journey, valleyId)
      return null;
    }
  }

  renderRequirementsList(list) {
    if (list && list.length) {
      return <ul>
        { list.map((listItem) => {
          // If the requirement is a quests (string is a quest ID)
          if (typeof listItem === 'string') {
            let questItem = this.props.journey.quests[listItem];
            
            if (questItem) {
              return <li key={questItem.id}>
                { (questItem) ? <a href={`#${questItem.id}`}>{questItem.name}</a> : listItem }
              </li>
            }
            else {
              console.error('Impossible to find the quest item:', listItem);
            }
          }
          // If not quest ID, it's an object with Age requirement
          else if (listItem.age) {
            let agePrereq = this.props.journey.ages[listItem.age];

            return <li key={listItem.age}>
              Age { getRomanAge(agePrereq) } required: Age of { agePrereq.name }
            </li>;
          }
          else {
            console.error('Unknown requirement type.', listItem);
          }
        })}
      </ul>
    }
    else {
      return <span>None.<br/></span>
    }
  }

  renderStage(stage) {
    if (stage.type === stageTypes.VIDEO) {
      return <Video activeStageData={stage} viewOnly={true} />
    }
    else if (stage.type === stageTypes.MUSIC_SHOWCASE) {
      return <MusicShowcase activeStageData={stage} viewOnly={true} />
    }
    else if (stage.type === stageTypes.FTC_SHOWCASE) {
      // TODO: Implement FTC Showcase
      return <p><em>FTC Showcase quests content not visible in this page.</em></p>
    }
    else if (stage.type === stageTypes.KANBAN) {
      // TODO: Implement Kanban
      return <p><em>KANBAN quests content not visible in this page.</em></p>
    }
    else {
      return <div className="stage"  key={stage.order}>
        <h4>{stage.order+1}. {stage.name}</h4>

        <Markdown mdContent={stage.content} />
      </div>
    }
  }

  renderQuiz(quest) {
    if (quest.quiz) {
      return <Quiz quizData={quest.quiz} inline={true} />
    }
  }

  renderQuestList() {
    if (isLoggedIn(this.props)) {
      if (isQuestsLoaded(this.props)) {
        return Object.keys(this.props.journey.quests).map((questId) => {
          let quest = this.props.journey.quests[questId];
          let valleyData = this.getValleyData(quest.valley);

          return <div key={quest.id}>
  
            <h2 className="title" id={quest.id}>{quest.name}</h2>
            <p>
              <strong>Quest Type:</strong> {quest.type}<br />
              <strong>Valley:</strong> {valleyData.name}<br /> { /* TODO: add valley icon */}
              { (quest.CTA) ? <div><strong>Custom Call to Action:</strong> { quest.CTA }<br /></div> : '' }
              { (quest.type === questTypes.WEBSITE) ? <div><strong>Start Url:</strong> <a href={quest.startUrl} target="_blank">{quest.startUrl}</a><br /></div> : '' }
              <strong>Pre-Requesites:</strong> { this.renderRequirementsList(quest.prerequisites) }
              <strong>Following:</strong> { this.renderRequirementsList(quest.following) }
            </p>
            <div className="description">
              <Markdown mdContent={quest.content} />
            </div>
            <div className="stages">
              <h3 className="stagesTitle">Stages</h3>
  
              {quest.stages.map((stage) => {
                return this.renderStage(stage);
              })}
            </div>
            { this.renderQuiz(quest) }
          </div>
        });
      }
      else {
        return <h1 className="text-center">Loading...</h1>
      }
    }
    else {
      return <h2>No user logged in.</h2>
    }
  }

  getJourneyName() {
    if (this.props.activePlayerData.journey === journeyIds.JOURNEY_FTC) {
      return "Future Trailblazer Challenge"
    }
    else if (this.props.activePlayerData.journey === journeyIds.JOURNEY_MUSIC) {
      return "Music for Change"
    }
  }

  render() {
    require('../../../sass/list.scss');
    var today = new Date();

    return <div className="contentListWrapper container">
      <div className="row">
        <div className="col-sm">
          <h1 className="header">Game Content</h1>
          <div className="text-center">
            <strong>Curriculum:</strong> { this.getJourneyName() }<br/>
            <em className="text-underline">Last updated:</em> {today.toDateString() }
          </div>
      
          { this.renderQuestList() } 
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => { 
  return {
    journey: state.journey,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    players: state.players,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getQuests, isLoggedIn }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(List);