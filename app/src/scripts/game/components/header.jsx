/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { questUnlocked, addComplete, getAge, getRomanAge, isLoggedInAndLoaded, getActivePlayerData, isLoggedIn, isQuestsLoaded, getAreaIconUrl } from '../../_utils';
import { getQuests, reloadQuests, logOut, startWalkthrough, stopWalkthrough, openTree, unselectQuest, resetQuests, resetActivePlayerJourney, openEmbeddedCredits, closeEmbeddedPage } from '../../../actions/index';
import { bindActionCreators } from 'redux';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: false,
      reset: false,
    }
    this.reloadQuestsIfNeeded();
  }
  
  componentDidUpdate() {
    this.reloadQuestsIfNeeded();
  }

  reloadQuestsIfNeeded() { 
    // Reload the quests if you just logged in but the quests aren't loaded yet
    if (this.state && this.state.reset) {
      if (isQuestsLoaded(this.props) && !isLoggedIn(this.props)) {
        this.props.unselectQuest();
        this.props.resetQuests();
        this.setState({
          reset: false,
        });
      }
    }
    else if (isLoggedIn(this.props) && !isQuestsLoaded(this.props)) {
      this.props.reloadQuests(this.props.activePlayerData.journey);
    }
  }
  
  isUnlocked(quest) {
    return questUnlocked(quest, this.props.journey);
  }

  startWalkthrough() {
    return (
      this.props.startWalkthrough
    );
  }

  resetQuests() {
    this.setState({
      reset: true,
      settings: false,
    })
  }

  logOutActivePlayer() {
    this.props.logOut();
    this.resetQuests();
  }

  resetActivePlayerJourney() {
    this.props.resetActivePlayerJourney();
    this.resetQuests();
  }

  getQuestsNumber(ageData, valleyName) {
    let rawNumber = ageData.requirements[valleyName];
    if (rawNumber === 'all') {
      if (valleyName === "total") {
        return addComplete(this.props.journey.quests,'','');
      }
      else {
        return addComplete(this.props.journey.quests,valleyName,'');
      }
    }
    else {
      return rawNumber;
    }
  }

  getRequirementsDisplay(ageData, valleyName){
    if(valleyName === "total") {
      return (
        <div className="col-md-2 col-sm-3 score" key={valleyName} data-helper={`GOAL: Complete ${this.getQuestsNumber(ageData, valleyName)} quests from any areas`}>
          <div className="icon all">ANY</div>
          <p className="value">{addComplete(this.props.journey.quests)} / { this.getQuestsNumber(ageData, valleyName) }</p>
        </div>      
      )
    } else {
      let areaData = this.props.journey.areas[valleyName];
      return (
        <div className="col-md-2 col-sm-3 score" key={valleyName} data-helper={`GOAL: Complete ${this.getQuestsNumber(ageData, valleyName)} quests from ${areaData.name}`}>
          <div className={"icon"} style={ {
            backgroundImage: `url('${ (areaData) ? areaData.image : '/images/Locked_grey.svg'}')`,
          } }></div>
          <p className="value">{addComplete(this.props.journey.quests, valleyName)} / { this.getQuestsNumber(ageData, valleyName) }</p>
        </div> 
      )
    }
  }

  renderRequirementsDisplay(ageData){
   return Object.keys(ageData.requirements).map( (valleyName) => {
      return this.getRequirementsDisplay(ageData, valleyName);
    });
  }

  startFirstWalkthrough() {
    this.props.closeEmbeddedPage();
    this.setState({ settings: false });
    this.props.startWalkthrough(1);
  }

  openCredits() {
    // this.props.unselectQuest();
    this.props.openEmbeddedCredits();
  }

  renderContent() {
    if (isLoggedInAndLoaded(this.props)) {
      let ageData = getAge(this.props.journey);
      return <div className="row">
        <div className="badgeTrackersHeader col-sm-5">
          <div className="row">
            {this.renderRequirementsDisplay(ageData)}
          </div>
        </div>
        <div className="age"> { /* onClick={ this.props.openTree  } */ }
          <div className="roman">
            <div className="age-text">AGE</div>
            <div className="number">{getRomanAge(ageData)}</div>
          </div>
          <div className="name">{ageData.name}</div>
        </div>

        <div className="col-sm-2 offset-sm-3">
          <div className="row">
            <div className="col-sm-11 user">
              {/* <a className={`action user-sdg sdg${this.props.activePlayerData.sdg}`} >{this.getPlayerSDG()}</a>  */}
              <p className="name">{this.props.activePlayerData.name}</p>
              <a className="action settings" onClick={ () => this.setState({ settings: !this.state.settings }) }></a>
            </div>
          </div>
        </div>
        <div className={`col-sm-2 dropdown ${(this.state.settings) ? 'visible': ''}`}>
          <div className="section-title">Settings</div>
          <div className="dropdown-action journey" onClick={ () => this.resetActivePlayerJourney() }>Change Your Journey</div>
          <div className="dropdown-action logout" onClick={ () => this.logOutActivePlayer() }>Log Out</div>
          <div className="dropdown-action reload" onClick={ () => this.props.reloadQuests(this.props.activePlayerData.journey) }>Reload Quests</div>
          <div className="section-title">Help</div>
          <div className="dropdown-action help" onClick={ () => this.startFirstWalkthrough() }>Getting Started</div>
          <a className="dropdown-action help" href={ chrome.extension.getURL('list.html') } target="_blank">Download Quests in PDF</a>
          <div className="dropdown-action help" onClick={ () => this.openCredits() }>Credits</div>
          <div className="dropdown-action help disabled">FAQs</div>
        </div>
      </div>;
    }
    else {
      return <div className="placeholder">
        <div className="aom-logo-simple">
          <img src="images/ageofmaker_name.png" alt="Age of Makers Logo"/>
        </div>
      </div>
    }
  }
  
  render() {
    return (
    <header className={`controls ${(isLoggedInAndLoaded(this.props)) ? '' : 'noBg'}`}>
        <div className="container-fluid">
          { this.renderContent() }
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => { 
  return {
    sid: state.sid,
    journey: state.journey,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    players: state.players,
    walkthrough: state.walkthrough,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getQuests, reloadQuests, logOut, startWalkthrough, stopWalkthrough, openTree, unselectQuest, resetQuests, resetActivePlayerJourney, openEmbeddedCredits, closeEmbeddedPage }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);

