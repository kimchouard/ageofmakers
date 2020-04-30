/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { logIn, unselectQuest } from '../../../actions/index';

import Bubble from '../../game/components/bubble';
import Accordions from '../../game/components/accordions';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        { (this.props.activeQuest && this.props.activeQuestData) ? <Bubble embed={true}><Accordions stages={ this.props.activeQuestData.stages }/></Bubble> : null }
      </div>
    );
    
  }
}

const mapStateToProps = (state) => {
  return {
    player: state.player,
    activeQuest: state.activeQuest,
    activeQuestData: (state.activeQuest) ? state.quests[state.activeQuest.quest] : null,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logIn, unselectQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
