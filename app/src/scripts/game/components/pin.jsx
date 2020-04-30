/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectQuest, toggleBubble } from '../../../actions/index';
import { questUnlocked, logOut } from '../../_utils';
import { bindActionCreators } from 'redux';

class Pin extends Component {
  constructor(props) {
    super(props);
  }

  openQuest(questKey) {
    this.props.toggleBubble(false);
    this.props.selectQuest(questKey);
  }

  isUnlocked(quest) {
    return questUnlocked(quest, this.props.quests);
  }

  render() {
    let pinQuest = this.props.quest;
    if(this.props.nodeData) {
      pinQuest = this.props.nodeData.questData
    }

    return (
      <div
          key={pinQuest.id}
          onClick={() => this.openQuest(pinQuest.id)}
          className={`pinWrapper ${(this.isUnlocked(pinQuest)) ? `${pinQuest.status} ${pinQuest.id}` : `locked ${pinQuest.id}`}  ${(this.props.noPulse) ? `noPulsate` : ``} `}>
          <div className={`pin ${(this.isUnlocked(pinQuest) && pinQuest.status !== 'complete' && !this.props.noBounce) ? 'bounce' : ''}`}>
            <div className={`inner ${(this.isUnlocked(pinQuest)) ? pinQuest.valley : 'Locked'}`}></div>
          </div>

          <div className="pulse"></div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    quests: state.quests,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectQuest, toggleBubble }, dispatch);
}

// Promote Pins from a component to a container - it needs to know
// about this new dispatch method, selectQuest. Make it available
// as a prop.
export default connect(mapStateToProps, mapDispatchToProps)(Pin);
