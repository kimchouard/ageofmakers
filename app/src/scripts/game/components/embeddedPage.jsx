/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { openEmbeddedQuest, closeEmbeddedPage, changeQuestProgress, selectQuest } from '../../../actions/index';
import { questTypes, stageTypes, getActiveQuestData, getStageData, getDefaultActiveStageOrder } from '../../_utils';
import MusicShowcase from './showcaseMusic';
import FTCShowcase from './showcaseFtc';
import Kanban from './kanban';
import Video from './video';
import Quiz from './quiz';
import Markdown from './markdown';

class EmbeddedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  getStageContentHtml(content) {
    if (content) {
      return <Markdown mdContent={content} />;
    }
  }

  renderEmbbededQuestContent() {
    if (this.props.embeddedPage.open && this.props.embeddedPage.type === 'quest' && this.props.activeQuestData && this.props.activeQuestData.type === questTypes.EMBEDDED) {
      let activeStageOrder = getDefaultActiveStageOrder(this.props.activeQuestData, this.props.embeddedPage);
      let activeStageData = getStageData(this.props.activeQuestData, activeStageOrder);

      if (!activeStageData) {
        console.log('Error while loading stage data', activeStageOrder, this.props.activeQuestData);
      }
      else {
        let stageDiv;
        if (activeStageData && activeStageData.type === stageTypes.MUSIC_SHOWCASE) {
          stageDiv = <MusicShowcase activeStageData={activeStageData} goToNextStage={(stage) => { this.goToNextStage(stage) } } />;
        }
        else if (activeStageData && activeStageData.type === stageTypes.FTC_SHOWCASE) {
          stageDiv = <FTCShowcase activeStageData={activeStageData} goToNextStage={(stage) => { this.goToNextStage(stage) } } />;
        }
        else if (activeStageData && activeStageData.type === stageTypes.KANBAN) {
          stageDiv = <Kanban />
        }
        else if (activeStageData && activeStageData.type === stageTypes.VIDEO) {
          stageDiv = <Video activeStageData={activeStageData} goToNextStage={(stage) => { this.goToNextStage(stage) } } />
        }
        // If the stage is a quiz
        else if (activeStageData && activeStageData.questions) {
          stageDiv = <Quiz quizData={activeStageData} saveQuiz={(questions) => { this.saveQuiz(questions) } } />
        }
        // Default is to show content from Markdown!
        else {
          // TODO: Errors on stage data type unknown
          console.error('Unknown stage type.', activeStageData);
        }

        let questDetails = <div className={ 'col-sm-10 offset-sm-1' }>
          <h2>{activeStageData.name}</h2>
          <h5>{activeStageData.subtitle}</h5>
          { this.getStageContentHtml(activeStageData.content) }
        </div>;

        return <div className={ (activeStageData && activeStageData.type === stageTypes.VIDEO) ? 'container-fluid' : 'container'}>
          <div className={ `row ` }>
            { (activeStageData && activeStageData.type !== stageTypes.VIDEO) ? questDetails : '' }
            { stageDiv }
          </div>
        </div>
      }
    }
    // If open but no active quests, it's for credits!
    else if (this.props.embeddedPage.open && this.props.embeddedPage.type === 'credits' && this.props.journey && this.props.journey.credits) {
      return <div className="container creditsWrapper">
        <div className="col">
          <h1>Credits</h1>
         <Markdown mdContent={this.props.journey.credits.credits}/>
        </div>
      </div>
    }
    else if (this.props.activeQuestData && this.props.activeQuestData.type !== questTypes.WEBSITE) {
      // TODO: Show error on unknown quests type
    }
  }

  nextViewId(isQuiz) {
    // If we're at the last stage, then close the quest
    if (this.props.activeQuestData.stages.length === this.props.embeddedPage.viewOrderId + 1) {
      // If there is no quiz or we're asking to go next from a quiz, then we clove the view page
      if (!this.props.activeQuestData.quiz || isQuiz) {
        this.props.closeEmbeddedPage();
      }
      // If we're having a quiz, then set the order id to -1 to show it
      else if (this.props.activeQuestData.quiz) {
        this.props.openEmbeddedQuest(-1);
      }
    }
    // If there is still more stages, then we go to the next one!
    else {
      this.props.openEmbeddedQuest(this.props.embeddedPage.viewOrderId+1);
    }
  }

  saveQuiz(questions, forcedSave) {
    if (this.viewOrderIsDefined() && !forcedSave) {
      this.nextViewId(true);
    }
    else if (!this.viewOrderIsDefined() || forcedSave) {
      this.props.changeQuestProgress(this.props.activeQuest.quest, null, null, questions);
    }

    this.props.closeEmbeddedPage();
  }

  goToNextStage(stage) {
    if (this.viewOrderIsDefined()) {
      this.nextViewId();
    }
    else {
      this.props.changeQuestProgress(this.props.activeQuest.quest, stage.order);
    }
    
    this.setActiveStageOrder(stage.order+1);
  }

  setActiveStageOrder(activeStageOrder) {
    if(activeStageOrder !== 0 && !activeStageOrder) {
      activeStageOrder = getDefaultActiveStageOrder(this.props.activeQuestData, this.props.embeddedPage);
    }

    this.setState({
      activeStageOrder
    });
  }

  viewOrderIsDefined() {
    return (this.props.embeddedPage.viewOrderId !== null && this.props.embeddedPage.viewOrderId !== undefined);
  }

  render() {
    // If the quest is done AND either no viewId is defined, close the embedded UI
    if (this.props.embeddedPage && this.props.embeddedPage.open && 
       (
         (this.props.activeQuestData && this.props.activeQuestData.status === 'complete' && !this.viewOrderIsDefined()) 
         || (this.props.activeQuest === null)
       ) 
    ) {
      console.log('Closing embedded page');
      this.props.closeEmbeddedPage();
    }

    return (
      <div className={ (this.props.embeddedPage.open) ? 'fullpage open' : 'fullpage'}>
        <div className="wrapper">
          { this.renderEmbbededQuestContent() }
          
          <a className="btn btn-dark btn-close-embedded" onClick={() => this.props.closeEmbeddedPage()}>Close</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    embeddedPage: state.embeddedPage,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    journey: state.journey,
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ openEmbeddedQuest, closeEmbeddedPage, changeQuestProgress, selectQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbeddedPage);
