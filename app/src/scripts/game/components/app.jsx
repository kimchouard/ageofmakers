/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { reloadQuests, getActivePlayer } from '../../../actions/index';
import { getActivePlayerData } from '../../_utils';

import Game from './game';

class App extends Component {

  componentDidMount() {
    // Onload, check if sid saved if not surfaced already
    if (!this.props.activePlayer) {
      this.props.getActivePlayer();
    }

    if (!this.props.quests) {
      this.props.reloadQuests(this.props.activePlayerData.journey);
    }
  }

  render() {
    return <Game />
  }
}

const mapStateToProps = (state) => {
  return {
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ reloadQuests, getActivePlayer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);