/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { isLoggedInAndLoaded } from '../../_utils';
import { getPlayers, logIn, setNewPlayer, removePlayer } from '../../../actions/index';


class Onboarding extends Component {
    constructor(props){
        super(props)
        this.state = {
          userName: '',
          newUserUi: false,
          userIdToLogin: null,
        }
    }

    componentDidMount() {
      if (!this.props.players) {
        this.props.getPlayers();
      }
    }

    startNewUserCreation() {
      console.log('Creating new user:', this.state.userName);
      this.props.setNewPlayer(this.state.userName);
      this.setState({ userName: '', newUserUi: false, userIdToLogin: Object.keys(this.props.players).length });
    }

    startRemovingPlayer(playerId) {
      console.log('Remove player:', playerId);
      let deleteConfirmation = confirm("You're sure you want to delete this player?");
      if (deleteConfirmation) {
        this.props.removePlayer(playerId);
      }
    }

    logIn(e, playerId) { 
      if (e.target.className == 'player-name') { 
        this.props.logIn(playerId);
      }
    }

    renderOnboarding() {
      // If a user was just created, log him in once the user is saved.
      if (this.state.userIdToLogin !== null && this.state.userIdToLogin >= 0) {
        if (!this.props.players || (this.props.players && !Object.keys(this.props.players).length)) {
          this.props.getPlayers();
        }
        else {
          this.props.logIn(this.state.userIdToLogin.toString());
          this.setState({ userIdToLogin: null });
        }
        
      }

      if (!this.props.activePlayerData && (!this.props.activePlayer || this.props.activePlayer === -1 )) {
        if (this.state.newUserUi || !this.props.players || (this.props.players && !Object.keys(this.props.players).length) ) {
          return <form className="name-form">
            <label htmlFor="playerName">
              <h1>Hi! 👋</h1>
              <h1>Welcome to your new adventure 🚀</h1>
              <h3>Let's get you all set-up for the fun.</h3>
            </label>
            <input
              type="text"
              id="playerName"
              placeholder="First, type your name here!"
              value={ this.state.userName }
              onChange={ e => this.setState({ userName: e.target.value }) }
              className="player-name" />
            <input type="submit" className="btn btn-login" value="Let's do it!" onClick={(e) => { e.preventDefault(); this.startNewUserCreation(); return false; }}/>
            <div className="clear-both"></div>
          </form>;
        }
        else {
          return <div>
            <h1>Hi! 👋</h1>
            <h3>Click on a player name to get started.</h3>
            {Object.keys(this.props.players).map((playerId) => {
              let player = this.props.players[playerId];

              return <div className="player" onClick={ (e) => { this.logIn(e, playerId); } }>
                <div className="player-name">{ player.name }</div>
                <button className="btn-delete" onClick={() => { this.startRemovingPlayer(playerId) }}>X</button>
              </div>
            })}
            <button className="btn btn-login" onClick={() => { this.setState({ newUserUi: true }) }}>+ New Player</button>
          </div>;
        }
      }
      else {
        return <div>
          <h1>Okay Kim, time to select your journey! 👀</h1>
          <h3>Click on an icon to get started.</h3>
        </div>
      }
    }

    render() {
        return(
            <div className={ (isLoggedInAndLoaded(this.props)) ? "onboardingWrapper" : "onboardingWrapper open"}>
                <div className="overlay"></div>
                <div className="onboarding">
                  { this.renderOnboarding() }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      quests: state.quests,
      activePlayer: state.activePlayer,
      activePlayerData: (state.players && state.activePlayer && state.activePlayer !== -1) ? state.players[state.activePlayer] : null,
      players: state.players,
    };
  };

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getPlayers, logIn, setNewPlayer, removePlayer}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);