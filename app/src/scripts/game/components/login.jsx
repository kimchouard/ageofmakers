/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPlayers, logIn, setNewPlayer, removePlayer } from '../../../actions/index';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newUserUi: false,
      userName: '',
    }
  }

  componentDidMount() {
    if (!this.props.players) {
      this.props.getPlayers();
    }
  }

  // To catch the undefined players when adding one
  componentDidUpdate() {
    if (!this.props.players) {
      this.props.getPlayers();
    }
  }

  showNewUserUi() {
    this.setState({ newUserUi: true });
  }

  startNewUserCreation() {
    console.log('Creating new user:', this.state.userName);
    this.props.setNewPlayer(this.state.userName);
    this.setState({ newUserUi: false, userName: '' });
  }

  startRemovingPlayer(playerId) {
    console.log('Remove player:', playerId);
    let deleteConfirmation = confirm("You're sure you want to delete this player?");
    if (deleteConfirmation) {
      this.props.removePlayer(playerId);
    }
  }

  renderPlayers() {
    console.log('Players', this.props.players);
    if (this.props.players) {
      return <div>
        { (Object.keys(this.props.players).length) ? <p className="instructionLogin">Click on an player name to login</p> : '' }
        { Object.keys(this.props.players).map((playerId) => {
          let player = this.props.players[playerId];
          return <div className="userList" onClick={ (e) => { if (e.target.className == 'userList') { this.props.logIn(playerId) } } }>
            <p className="userName">{player.name}</p>
            <button className="btn-delete" onClick={ () => { this.startRemovingPlayer(playerId) } }>X</button>
            <div className="clear"></div>
          </div>
        })}
      </div>;
    }
  }

  renderDetails() {
    if (this.state.newUserUi) {
      return <form>
        <input
          type="text"
          placeholder="Player Name"
          value={ this.state.userName }
          onChange={ e => this.setState({ userName: e.target.value }) } />
        <input type="submit" className="btn-login" value="Create a new player" onClick={() => { this.startNewUserCreation() }}/>
      </form>
    }
    else {
      return <div>
        { this.renderPlayers() }
        <a  className="btn-login" onClick={() => { this.showNewUserUi() }}>+ New Player</a>
      </div>
    }
  }

  render() {
    require('../../../sass/login.scss');
    
    return (
      <div className="login-page">
        <div className="form">
          <div className="logo">
            <img src="images/Age_of_Makers_full.png" />
          </div>

          { this.renderDetails() }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activePlayer: state.activePlayer,
    activePlayerData: (state.activePlayer && state.activePlayer !== -1) ? state.players[state.activePlayer] : null,
    players: state.players,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPlayers, setNewPlayer, removePlayer, logIn }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);