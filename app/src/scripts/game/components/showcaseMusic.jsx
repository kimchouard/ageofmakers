/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeEmbeddedQuest, setActivePlayerSDG, changeQuestProgress, startQuest } from '../../../actions/index';
import { getActiveQuestData, getActivePlayerData, stageStatus } from '../../_utils';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';


class MusicShowcase extends Component {
  constructor(props) {
      super(props);
  }

  startShowcaseBt(showcaseItem) {
    this.props.startQuest(this.props.activeQuest.quest, this.props.currentTab.id, showcaseItem.order);
    window.location = showcaseItem.startUrl;
  }

  renderActionBtn(showcaseItem) {
    if (showcaseItem.status === stageStatus.STATUS_COMPLETE) {
      return <div className="btn btn-done">✓ COMPLETED</div>
    }
    else {
      return <div className="btn btn-action" onClick={ () => { this.startShowcaseBt(showcaseItem); } }>Listen to the story</div>
    }
  }

  renderShowcaseItems() {
    if (this.props.activeStageData.showcaseItems) {
      return this.props.activeStageData.showcaseItems.map((song) => {
        return <div className="col-md-4" key={song.order}>
          <div className="song">
            <div className="row title">
              <div className="name">{song.name}</div>
              <div className="artist"><strong>By:</strong> {song.artist}</div>
            </div>
            <div className="desc">
              <ReactMarkdown
                source={song.content}
                renderers={ mdRenderers }
              />
            </div>
            <div className="actions">
              { this.renderActionBtn(song) }
            </div>
          </div>
        </div>
      });
    }
    else {
      console.error('No showcase items to showcase on the current quest.');
    }
  }

  renderNextButton() {
    let countVisitedShowcaseItem = 0;
    this.props.activeStageData.showcaseItems.forEach((showcaseItem) => {
      if (showcaseItem.status === stageStatus.STATUS_COMPLETE) {
        countVisitedShowcaseItem++;
      }
    })

    // Only disable the next button if the player visited enough showcase items
    return <div className={`btn btn-danger ${ (this.props.embeddedQuest.open) ? 'btn-next' : ''} ${ (countVisitedShowcaseItem >= this.props.activeStageData.requiredShowcaseViews) ? '' : 'disabled'}`} onClick={() => { if((countVisitedShowcaseItem >= this.props.activeStageData.requiredShowcaseViews)) { this.props.goToNextStage(this.props.activeStageData) } } }>NEXT</div>;
  }

  render() {
    if (this.props.activeStageData) {
      return <div className="col-sm-12 instructionsWrapper">
        { this.renderNextButton() }
        <p className="instructions">Explore at least {this.props.activeStageData.requiredShowcaseViews} examples below and click NEXT to continue the quest.</p>

        <div className="row">
          { this.renderShowcaseItems() }
        </div>
      </div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    embeddedQuest: state.embeddedQuest,
    activePlayerData: getActivePlayerData(state),
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    currentTab: state.currentTab,
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest, setActivePlayerSDG, changeQuestProgress, startQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicShowcase);
