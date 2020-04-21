/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCookie, getParamsFromSearch, apiUrl } from '../../_utils';
import { logIn, unselectQuest } from '../../../actions/index';

import Bubble from '../../game/components/bubble';
import Accordions from '../../game/components/accordions';

class App extends Component {
  constructor(props) {
    super(props);
  }

  checkSid() {
    if (location.href.search(apiUrl) !== -1 && location.pathname === '/loggedIn') {
      console.log('API website detected.');

      if (!this.props.player) {
        this.props.logIn();
      }
      else {
        let messageDiv = document.getElementById('message');
        messageDiv.innerHTML = 'Loading...';
        
        let count = 3;
        let intId = setInterval((() => {
          if (count === 0) {
            messageDiv.innerHTML = 'Redirecting to new tab...';
            clearInterval(intId);
            // Used to redirect to new tab
            this.props.unselectQuest(true);
          }
          else {
            messageDiv.innerHTML = `Redirecting to a new tab in ${ count } seconds`;
            count--;
          }
        }).bind(this), 1000);

        setTimeout(() => {
          messageDiv.innerHTML = 'Open a new tab to start the game!';
        }, 2000*count);
      }
    }
  }

  render() {
    this.checkSid();
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
