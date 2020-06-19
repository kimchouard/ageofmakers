/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeEmbeddedQuest, changeStage } from '../../../actions/index';
import { questTypes, stageTypes, getActiveQuestData, getStageData, getDefaultActiveStageOrder } from '../../_utils';
import Showcase from './showcase';
import Kanban from './kanban';
import Video from './video';

class EmbeddedQuest extends Component {
  constructor(props) {
      super(props);

      this.state = {
        activeStageOrder: getDefaultActiveStageOrder(this.props.activeQuestData),
      }
  }

  renderEmbbededQuestContent() {
    if (this.props.embeddedQuest.open && this.props.activeQuestData && this.props.activeQuestData.type === questTypes.EMBEDDED) {
      let activeStageData = getStageData(this.props.activeQuestData, this.state.activeStageOrder);

      if (!activeStageData) {
        this.setState({
          activeStageOrder: getDefaultActiveStageOrder(this.props.activeQuestData),
        });
      }

      if (activeStageData && activeStageData.type === stageTypes.SHOWCASE) {
        return <Showcase activeStageData={activeStageData} goToNextStage={(stage) => { this.goToNextStage(stage) } } />;
      }
      else if (activeStageData && activeStageData.type === stageTypes.KANBAN) {
        return <Kanban />
      }
      else if (activeStageData && activeStageData.type === stageTypes.VIDEO) {
        return <Video activeStageData={activeStageData} goToNextStage={(stage) => { this.goToNextStage(stage) } } />
      }
      else {
        // TODO: Errors on stage data type unknown
      }
    }
    else if (this.props.activeQuestData && this.props.activeQuestData.type !== questTypes.WEBSITE) {
      // TODO: Show error on unknown quests type
    }
  }

  goToNextStage(stage) {
    this.props.changeStage(this.props.activeQuest.quest, stage.order);
    this.setActiveStageOrder(stage.order+1);
  }

  setActiveStageOrder(activeStageOrder) {
    if(activeStageOrder !== 0 && !activeStageOrder) {
      activeStageOrder = getDefaultActiveStageOrder(this.props.activeQuestData);
    }

    this.setState({
      activeStageOrder
    });
  }

  render() {
    if (this.props.embeddedQuest && this.props.activeQuestData) {
      // If the quest is done
      if (this.props.activeQuestData.stages[this.props.activeQuestData.stages.length-1].status === 'complete') {
        this.props.closeEmbeddedQuest();
      }

      return (
        <div className={ (this.props.embeddedQuest.open) ? 'fullpage open' : 'fullpage'}>
            <div className="wrapper">
                <div className="container">
                    { this.renderEmbbededQuestContent() }
                </div>
                <a className="btn btn-danger btn-close" onClick={() => this.props.closeEmbeddedQuest()}>CLOSE</a>
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
    embeddedQuest: state.embeddedQuest,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest, changeStage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbeddedQuest);
