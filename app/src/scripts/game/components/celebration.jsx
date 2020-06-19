/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getActivePlayerData, isNewAge, getAge } from '../../_utils';
import { getPlayers, changeAge } from '../../../actions/index';


class Celebration extends Component {
  constructor(props){
      super(props)
      this.state = {
        showMetrics: false,
      }
  }

  componentDidMount() {
    if (!this.props.players) {
      this.props.getPlayers();
    }
  }

  startShowingMetrics() {
    this.setState({
      showMetrics: true
    });
  }

  saveAgeAchievements() {
    this.props.changeAge(this.props.activePlayerData.journey, getAge(this.props.journey).index);
    this.setState({
      showMetrics: false
    });
  }

  renderCelebration() {
    if (this.state.showMetrics) {
      return <div className="metrics">
        <h4>Here's what you need to complete in order to go to the next age.</h4>
        <button className="btn btn-select" onClick={(e) => { return this.saveAgeAchievements(); }}>Let's do it!</button>
      </div>
    }
    else {
      return <div className="celebration">
        <h1>CONGRATS!</h1>
        <h3>You just reached a new age.</h3>
        <button className="btn btn-select" onClick={(e) => { return this.startShowingMetrics(); }}>What's Next??</button>
      </div>
    }
  }

  render() {
    // If the new age hasn't been saved in the achievements yet
    if (isNewAge(this.props.activePlayerData,this.props.journey)) {
      return(
          <div className={`celebrationWrapper open`}>
              <div className="overlay"></div>
              { this.renderCelebration() }
          </div>
      );
    }
    else {
      return <div className={"celebrationWrapper"}></div>
    }
  }
}

const mapStateToProps = (state) => {
    return {
      journey: state.journey,
      activePlayer: state.activePlayer,
      activePlayerData: getActivePlayerData(state),
      players: state.players,
    };
  };

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getPlayers, changeAge}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Celebration);