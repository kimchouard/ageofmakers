/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentTab, startQuest, updateQuestUrl, unselectQuest, toggleBubble } from '../../../actions/index';
import { getActiveQuestData } from '../../_utils';

class Bubble extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getCurrentTab();

    window.addEventListener('focus', this.props.getCurrentTab);
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
            className={`box-header ${this.props.activeQuestData.valley}`}
            onClick={() => this.props.toggleBubble(this.props.bubbleToggled)}>
            <label htmlFor="acc-close" className="box-title">{this.props.activeQuestData.name}</label>
          </div>
          
          <div className="boxAccordionWrapper">
            { this.props.children }
          </div>
          
          <div
            className="exit-btn"
            onClick={() =>  {
                // Keep the actual url, if returning on the map from a quest
                if (this.props.embed) {
                  this.props.updateQuestUrl(this.props.journey.quests, this.props.activeQuest.quest, window.location.href);
                }
                this.props.unselectQuest((this.props.embed) ? this.props.currentTab : null);
              }
            } ></div>
          
          <div
            className={`box-footer`}
            onClick={() => this.props.toggleBubble(this.props.bubbleToggled)}>
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
    activeQuestData: getActiveQuestData(state),
    journey: state.journey,
    activeQuest: state.activeQuest,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getCurrentTab, startQuest, updateQuestUrl, unselectQuest, toggleBubble }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Bubble);
