/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeQuestProgress, unselectQuest, backToNewTab, logOut } from '../../../actions/index';
import { getActiveQuestData, getStageData, getDefaultActiveStageOrder, stageStatus } from '../../_utils';
import Quiz from './quiz';
import Markdown from './markdown';

class Accordions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStageOrder: getDefaultActiveStageOrder(this.props.activeQuestData),
    }
  }

  componentDidMount() {
    this.scrollToStage(this.state.activeStageOrder);
  }

  scrollToStage(stageOrder) {
    if (this.props.activeQuest && this.props.activeQuest.showcase === undefined) {
      ReactDOM.findDOMNode(this).parentNode.scrollTop = 64*stageOrder;
    }
  }

  setActiveStageOrder(activeStageOrder) {
    if(activeStageOrder !== 0 && !activeStageOrder) {
      activeStageOrder = getDefaultActiveStageOrder(this.props.activeQuestData);
    }
    this.scrollToStage(activeStageOrder);

    this.setState({
      activeStageOrder
    });
  }

  resetStages() {
    this.props.changeQuestProgress(this.props.activeQuest.quest, 'none');
    this.setActiveStageOrder();
  }

  nextStage(stage) {
    this.scrollToStage(stage.order+1);
    this.props.changeQuestProgress(this.props.activeQuest.quest, stage.order);
    this.setActiveStageOrder(stage.order+1);
  }

  backToShowcaseItems(stage, showcaseItem, questions) {
    this.props.changeQuestProgress(this.props.activeQuest.quest, stage.order, showcaseItem.order, questions);
    this.props.backToNewTab(this.props.activeQuest.quest);
  }

  saveQuizResults(questions) {
    this.props.changeQuestProgress(this.props.activeQuest.quest, null, null, questions);
  }
  renderShowcaseAction(stage, showcaseItem) {
    if (stage.quiz) {
      return <Quiz quizData={stage.quiz} saveQuiz={(questions) => { this.backToShowcaseItems(stage, showcaseItem, questions) } } embedded={true} inline={true} />
    }
    else {
      <div className="action">
        <div
          className="button complete"
          onClick={ () => { this.backToShowcaseItems(stage, showcaseItem) } }>
          I READ IT!
        </div>
      </div>
    }
  }

  renderAccordions() {
    // If the quest is done
    if (this.props.activeQuestData.stages[this.props.activeQuestData.stages.length-1].status === 'complete') {
      // Show the quiz if there is one
      if (this.props.activeQuestData.quiz && !this.props.activeQuestData.quiz.results) {
        return <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>{this.props.activeQuestData.quiz.name}</h2>
            <h5>{this.props.activeQuestData.quiz.subtitle}</h5>
            <Quiz quizData={this.props.activeQuestData.quiz} saveQuiz={(questions) => { this.saveQuizResults(questions) } } embedded={true} inline={true} />
          </div>
        </div>
      </div>
      }
      else {
        return <div className="congrats">
          <div className="title">Quest Completed!</div>

          <div className="action">
            <div
              className="btn btn-success"
              onClick={ () => { this.props.backToNewTab(this.props.activeQuest.quest) } }>
              What's next??
            </div>
          </div>        

          <div className="action">
            <div
              className="btn btn-primary"
              onClick={ () => { this.resetStages() } }>
              Restart
            </div>
          </div>

          <img src={ chrome.extension.getURL("images/high-five_beige.gif") } />
        </div>;
      }
    }
    else {
      // If it's a showcase embedded quest
      if (this.props.activeQuest.showcase >= 0) {
        for(let stage of this.props.activeQuestData.stages) {
          // If it's a music showcase stage and in progress or it's the first stage, which means it's potentially new.
          if ((stage.status === stageStatus.STATUS_INPROGRESS || stage.order == 0) && stage.type === 'musicShowcase') {
            for(let showcaseItem of stage.showcaseItems) {
              // If it's the showcase we are working on
              if (showcaseItem.order === this.props.activeQuest.showcase) {
                return <div className="accordion quizAccordion container-fluid">
                  <div className="col-12">
                    <h3>{showcaseItem.name} by {showcaseItem.artist}</h3>
                    
                    <Markdown mdContent={showcaseItem.instructions} />
                  </div>
                
                  <div className="col-12">
                    { this.renderShowcaseAction(stage, showcaseItem) }  
                  </div>
                </div>
              }
            }
          }
        }
      }
      // Or if it's a regular website quest.
      else {
        return this.props.activeQuestData.stages.map((stage) => {
          return <div
            className="accordion"
            key={stage.order}
          >
            <input
              type="radio"
              name="accordion"
              id={stage.order}
              checked={ (stage.order === this.state.activeStageOrder) }
              onChange={ () => { /*this.setActiveStageOrder(stage)*/ } }
            />
  
            <div className="box-accordion">
              <label
                className="box-title"
                onClick={ () => { this.setActiveStageOrder(stage.order) } }
                data-number={ (stage.status === 'complete') ? '✔' : stage.order + 1 }
              >
                {stage.name}
              </label>
  
              <div className="box-content">
                <Markdown mdContent={stage.content} />
  
                <div className="action">
                  <div
                    className="btn btn-primary"
                    onClick={ () => { this.nextStage(stage) } }>
                    I DID IT!
                  </div>
                </div>
              </div>
            </div>
          </div>;
        });  
      }
    }
  }

  render() {
    if (this.props.journey.quests && this.props.journey.quests.error) {
      debugger;
      this.props.logOut();
      this.props.unselectQuest(this.props.currentTab);
    }
    else {
      return <div className='boxAccordion' style={ {
        maxHeight: window.innerHeight-50-50-100
      }}>
        { this.renderAccordions() }
      </div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    journey: state.journey,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    currentTab: state.currentTab,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeQuestProgress, unselectQuest, backToNewTab, logOut }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accordions);
