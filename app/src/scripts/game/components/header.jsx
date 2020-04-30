/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { questUnlocked, addComplete, getAge, getRomanAge } from '../../_utils';
import { getQuests, reloadQuests, logOut, startWalkthrough, stopWalkthrough, openWelcome, openTree } from '../../../actions/index';
import { bindActionCreators } from 'redux';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  
  isUnlocked(quest) {
    return questUnlocked(quest, this.props.quests);
  }

  startWalkthrough() {
    return (
      this.props.startWalkthrough
    );
  }

  getQuestsNumber(ageData, valleyName) {
    let rawNumber = ageData.requirements[valleyName];
    if (rawNumber === 'all') {
      if (valleyName === "total") {
        return addComplete(this.props.quests,'','');
      }
      else {
        return addComplete(this.props.quests,valleyName,'');
      }
    }
    else {
      return rawNumber;
    }
  }

  getRequirementsDisplay(ageData, valleyName){
    if(valleyName === "total") {
      return (
          <div className="col-sm-3 score" key={valleyName}>
            <div className="icon all">ANY</div>
            <p className="value">{addComplete(this.props.quests)} / { this.getQuestsNumber(ageData, valleyName) }</p>
          </div>      
      )
    } else {
        return (
          <div className="col-sm-3 score" key={valleyName}>
            <div className={"icon " + valleyName}></div>
            <p className="value">{addComplete(this.props.quests, valleyName)} / { this.getQuestsNumber(ageData, valleyName) }</p>
          </div> 
        )
    }
  }

  renderRequirementsDisplay(ageData){
   return Object.keys(ageData.requirements).map( (valleyName) => {
      return this.getRequirementsDisplay(ageData, valleyName);
    });
  }
  
  render() {
    let ageData = getAge(this.props.quests);
    return (
    <header className="controls">
        <div className="container-fluid">
          <div className="badgeTrackersHeader col-sm-4">
            {this.renderRequirementsDisplay(ageData)}
          </div>
          <div className="col-sm-2 col-sm-offset-1 age" onClick={this.props.openTree}>
            <div className="roman">
              <div className="age-text">AGE</div>
              <div className="number">{getRomanAge(ageData.index)}</div>
            </div>
            <div className="name">{ageData.name}</div>
          </div>

          <div className="col-sm-2 col-sm-offset-3 user">
            <a className="action help" onClick={this.props.openWelcome}>?</a> 
            <p className="name">{this.props.activePlayerData.name}</p>
            <a className="action logout" onClick={ this.props.logOut }></a>
            <a className="action refresh" onClick={ this.props.reloadQuests }></a>
          </div>
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => { 
  return {
    sid: state.sid,
    quests: state.quests,
    activePlayer: state.activePlayer,
    activePlayerData: (state.activePlayer) ? state.players[state.activePlayer] : null,
    players: state.players,
    walkthrough: state.walkthrough,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getQuests, reloadQuests, logOut, startWalkthrough, stopWalkthrough, openWelcome, openTree }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);

