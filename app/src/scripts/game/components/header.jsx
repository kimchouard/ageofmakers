/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import 'bootstrap';
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
    this.props.closeEmbeddedPage();
    this.resetQuests();
  }

  resetActivePlayerJourney() {
    this.props.resetActivePlayerJourney();
    this.props.closeEmbeddedPage();
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
        <li className="nav-item score" key={valleyName} data-helper={`GOAL: Complete ${this.getQuestsNumber(ageData, valleyName)} quests from ${areaData.name}`}>
          <div className={"icon"} style={ {
            backgroundImage: `url('${ (areaData) ? areaData.image : '/images/Locked_grey.svg'}')`,
          } }></div>
          <p className="value">{addComplete(this.props.journey.quests, valleyName)} / { this.getQuestsNumber(ageData, valleyName) }</p>
        </li> 
      )
    }
  }

  renderRequirementsDisplay(ageData){
   return Object.keys(ageData.requirements).map( (valleyName) => {
      return this.getRequirementsDisplay(ageData, valleyName);
    });
  }

  startDefaultWelcomeWalkthrough() {
    this.props.closeEmbeddedPage();
    this.setState({ settings: false });
    this.props.startWalkthrough('welcome_walkthrough');
  }

  openCredits() {
    // this.props.unselectQuest();
    this.props.openEmbeddedCredits();
  }

  renderContent() {
    if (isLoggedInAndLoaded(this.props)) {
      let ageData = getAge(this.props.journey);
      return <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {this.renderRequirementsDisplay(ageData)}
          </ul>
        </div>
        
        <div className="navbar-brand age"> { /* onClick={ this.props.openTree  } */ }
          <div className="roman">
            <div className="age-text">AGE</div>
            <div className="number">{getRomanAge(ageData)}</div>
          </div>
          <div className="name">{ageData.name}</div>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle settings" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {this.props.activePlayerData.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-lg-end" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item journey" onClick={ () => this.resetActivePlayerJourney() }>Change Your Journey</a></li>
                <li><a className="dropdown-item logout"  onClick={ () => this.logOutActivePlayer() }>Log Out</a></li>
                <li><a className="dropdown-item reload" onClick={ () => this.props.reloadQuests(this.props.activePlayerData.journey) }>Reload Quests</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item help" onClick={ () => this.startDefaultWelcomeWalkthrough() }>Getting Started</a></li>
                <li><a className="dropdown-item help" href={ chrome.extension.getURL('list.html') } target="_blank">Download Quests in PDF</a></li>
                <li><a className="dropdown-item help" onClick={ () => this.openCredits() }>Credits</a></li>
                <li><a className="dropdown-item help disabled">FAQs</a></li>
              </ul>
            </li>
          </ul>
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
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark game-header ${(isLoggedInAndLoaded(this.props)) ? '' : 'noBg'}`}>
      { this.renderContent() }
    </nav>
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

