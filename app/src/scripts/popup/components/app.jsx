/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { logOut, getQuests, getActivePlayer, openNewTab } from '../../../actions/index';
import { bindActionCreators } from 'redux';

// import Login from '../../game/components/login';

class App extends Component {
  componentDidMount() {
    // Onload, check if sid saved if not surfaced already
    if (!this.props.activePlayer) {
      this.props.getActivePlayer();
    }
  }

  activeQuest() {
    if (this.props.activeQuest) {
      return `Active Quest: ${this.props.journey.quests[this.props.activeQuest.quest].name}`;
    }
    else {
      return `No Active Quests`;
    }
  }

  render() {
    if (!this.props.activePlayer || this.props.activePlayer === -1 ) {
      return <div></div>// <Login />;
    }
    // Logout if error
    else if (this.props.journey.quests && this.props.journey.quests.error) {
      this.props.logOut();
      return <div></div>// <Login />;
    }
    else {
      return (
        <div>
          {this.activeQuest()}

          <div className="action">
            <button
              onClick={ () => { this.props.openNewTab((this.props.activeQuest) ? this.props.activeQuest.quest : null); } }>
              Open Game
            </button>
          </div>

          <div className="action">
            <a
              type="button"
              className="button"
              onClick={ this.props.logOut }
              target="_blank">
              Logout
            </a>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    activePlayer: state.activePlayer,
    journey: state.journey,
    activeQuest: state.activeQuest,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logOut, getQuests, getActivePlayer, openNewTab }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
