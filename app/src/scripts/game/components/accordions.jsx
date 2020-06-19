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
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';
import { changeStage, unselectQuest, backToNewTab, logOut } from '../../../actions/index';
import { getActiveQuestData, getStageData, getDefaultActiveStageOrder } from '../../_utils';

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
    ReactDOM.findDOMNode(this).parentNode.scrollTop = 64*stageOrder;
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
    this.props.changeStage(this.props.activeQuest.quest, 'none');
    this.setActiveStageOrder();
  }

  nextStage(stage) {
    this.scrollToStage(stage.order+1);
    this.props.changeStage(this.props.activeQuest.quest, stage.order);
    this.setActiveStageOrder(stage.order+1);
  }

  renderAccordions() {
    // If the quest is done
    if (this.props.activeQuestData.stages[this.props.activeQuestData.stages.length-1].status === 'complete') {
      return <div className="congrats">
        <div className="title">Quest Completed!</div>

        <div className="action">
          <div
            className="button complete"
            onClick={ () => { this.props.backToNewTab(this.props.activeQuest.quest) } }>
            What's next??
          </div>
        </div>        

        <div className="action">
          <div
            className="button new"
            onClick={ () => { this.resetStages() } }>
            Restart
          </div>
        </div>

        <img src={ chrome.extension.getURL("images/high-five_beige.gif") } />
      </div>
    }
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
              <ReactMarkdown
                source={stage.content}
                renderers={ mdRenderers }
              />

              <div className="action">
                <div
                  className="button complete"
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

  render() {
    if (this.props.journey.quests && this.props.journey.quests.error) {
      debugger;
      this.props.logOut();
      this.props.unselectQuest(this.props.currentTab);
    }
    else {
      return <div className='boxAccordion'>
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
  return bindActionCreators({ changeStage, unselectQuest, backToNewTab, logOut }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accordions);
