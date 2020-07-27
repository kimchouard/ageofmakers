/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeEmbeddedPage, changeQuestProgress, selectQuest } from '../../../actions/index';
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
      let activeStageOrder = getDefaultActiveStageOrder(this.props.activeQuestData, this.props.activeQuest);
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

        return <div className="row">
          <div className="col-sm-10 offset-sm-1">
            <h2>{activeStageData.name}</h2>
            <h5>{activeStageData.subtitle}</h5>
            { this.getStageContentHtml(activeStageData.content) }
          </div>
          <div className="col-12">
            { stageDiv }
          </div>
        </div>
      }
    }
    // If open but no active quests, it's for credits!
    else if (this.props.embeddedPage.open && this.props.embeddedPage.type === 'credits' && this.props.journey && this.props.journey.credits) {
      return <div className="row creditsWrapper">
        <div className="col-md-6 offset-md-3">
          <h1>Credits</h1>
         <Markdown  mdContent={this.props.journey.credits.credits}/>
        </div>
      </div>
    }
    else if (this.props.activeQuestData && this.props.activeQuestData.type !== questTypes.WEBSITE) {
      // TODO: Show error on unknown quests type
    }
  }

  nextViewId(isQuiz) {
    // If we're at the last stage, then close the quest
    if (this.props.activeQuestData.stages.length === this.props.activeQuest.viewOrderId + 1) {
      // If there is no quiz or we're asking to go next from a quiz, then we clove the view page
      if (!this.props.activeQuestData.quiz || isQuiz) {
        this.props.selectQuest(this.props.activeQuestData.id);
      }
      // If we're having a quiz, then set the order id to -1 to show it
      else if (this.props.activeQuestData.quiz) {
        this.props.selectQuest(this.props.activeQuestData.id, -1);
      }
    }
    else {
      this.props.selectQuest(this.props.activeQuestData.id, this.props.activeQuest.viewOrderId+1);
    }
  }

  saveQuiz(questions) {
    if (this.viewOrderIsDefined()) {
      this.nextViewId(true);
    }
    else {
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
      activeStageOrder = getDefaultActiveStageOrder(this.props.activeQuestData, this.props.activeQuest);
    }

    this.setState({
      activeStageOrder
    });
  }

  viewOrderIsDefined() {
    return (this.props.activeQuest.viewOrderId !== null && this.props.activeQuest.viewOrderId !== undefined);
  }

  render() {
    if (this.props.embeddedPage) {
      // If the quest is done AND either no viewId is defined, close the embedded UI
      if (this.props.activeQuestData && this.props.activeQuestData.status === 'complete' && !this.viewOrderIsDefined()) {
        this.props.closeEmbeddedPage();
      }

      return (
        <div className={ (this.props.embeddedPage.open) ? 'fullpage open' : 'fullpage'}>
            <div className="wrapper">
                <div className="container">
                    { this.renderEmbbededQuestContent() }
                </div>
                <a className="btn btn-danger btn-close" onClick={() => this.props.closeEmbeddedPage()}>CLOSE</a>
            </div>
        </div>
      );
    }
    else {
      return <div>Loading</div>
    }  
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
return bindActionCreators({ closeEmbeddedPage, changeQuestProgress, selectQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbeddedPage);
