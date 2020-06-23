/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import D3Tree from './d3Tree'
import { startWalkthrough, closeTree } from '../../../actions/index';
import { addComplete, getActivePlayerData } from '../../_utils';


class AgeTree extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    if (this.props.tree && this.props.activePlayerData && this.props.activePlayerData.name) {
      return (
        <div className={(this.props.tree.open) ? "ageWrapper open" : "ageWrapper"}>
          <div className="overlay" onClick={this.props.closeTree}></div>
          <div className="ageProgress">
            <div className="container">
              <div className="row">
                <h3 className="col-sm-12 profileName">Hello {this.props.activePlayerData.name}!</h3>
                <h4 className="col-sm-12 questsBeat">You beat {addComplete(this.props.journey.quests, null)} quest(s)!</h4>
                <a className="btn btn-danger closingbutton" onClick={() => this.props.closeTree()}>CLOSE</a>
              </div>
            </div>
            <div className="col-sm-12 ageBox" >
              <D3Tree />
            </div>
          </div>
        </div>
      );
    }
    else {
      return <div></div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    tree: state.tree,
    sid: state.sid,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    players: state.players,
    journey: state.journey,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ startWalkthrough, closeTree }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgeTree);