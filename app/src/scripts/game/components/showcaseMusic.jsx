/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { setActivePlayerSDG, changeQuestProgress, startQuest } from '../../../actions/index';
import { getActiveQuestData, getActivePlayerData, stageStatus } from '../../_utils';
import Markdown from './markdown';

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
      return <button className="btn btn-success" disabled={true} >✓ COMPLETED</button>
    }
    else {
      return <button className="btn btn-primary btn-action" onClick={ () => { this.startShowcaseBt(showcaseItem); } }>Listen to the story</button>
    }
  }

  renderShowcaseItems() {
    if (this.props.activeStageData.showcaseItems) {
      return this.props.activeStageData.showcaseItems.map((song) => {
        return <div className="col mb-4">
          <div className={ `card bg-secondary h-100 ${ (song.status === stageStatus.STATUS_COMPLETE) ? 'border-success' : ''}` } key={song.order}>
            <img src={song.imageUrl} className="card-img-top" alt={ `Image for ${song.name} by ${song.artist}`} />
            <div className="card-body">
              <h5 className="card-title">{song.name} by {song.artist}</h5>
              <div className="card-text">
                <Markdown mdContent={song.content} />
              </div>
              <p className="card-text"><strong>📆 Historical Context: </strong> {song.historicalContext}</p>
            </div>
            <div className="card-footer actions">
              { this.renderActionBtn(song) }
            </div>
          </div>
        </div>
        // <div className="col-md-4" key={song.order}>
        //   <div className="song">
        //     <div className="row title">
        //       <div className="name">{song.name}</div>
        //       <div className="artist"><strong>By:</strong> {song.artist}</div>
        //     </div>
        //     <div className="desc">
        //       <Markdown
        //         mdContent={song.content}
        //       />
        //     </div>
        //     <div className="actions">
        //       { this.renderActionBtn(song) }
        //     </div>
        //   </div>
        // </div>
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
    return <button
      className={`btn btn-primary btn-lg btn-next`}
      onClick={() => { if((countVisitedShowcaseItem >= this.props.activeStageData.requiredShowcaseViews)) { this.props.goToNextStage(this.props.activeStageData) } } }
      disabled={ (countVisitedShowcaseItem < this.props.activeStageData.requiredShowcaseViews) }
    >
      NEXT
    </button>;
  }

  render() {
    if (this.props.activeStageData) {
      return <div className="col-sm-12 instructionsWrapper">
        <div className="text-center">
          { this.renderNextButton() }
        </div>
        <p className="instructions">Explore at least {this.props.activeStageData.requiredShowcaseViews} examples below and click NEXT to complete the quest.</p>

        <div className="row songs row-cols-2 row-cols-md-3">
          { this.renderShowcaseItems() }
        </div>
      </div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    embeddedPage: state.embeddedPage,
    activePlayerData: getActivePlayerData(state),
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    currentTab: state.currentTab,
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ setActivePlayerSDG, changeQuestProgress, startQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicShowcase);
