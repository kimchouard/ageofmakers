/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { isLoggedInAndLoaded, isNewAge, getActivePlayerData, getActiveQuestData } from '../../_utils';
import { } from '../../../actions/index';

import Header from './header';
import Bubble from './bubble';
import EmbeddedPage from './embeddedPage';
import Walkthrough from './walkthrough';
import Onboarding from './onboarding';
import LeafletMap from './leafletMap';
import AgeTree from './ageTree';
import AnalyticsProvider from './analyticsProvider';

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    require('../../../sass/game.scss');

    return (
      <div className={`gameWrapper ${ (!isLoggedInAndLoaded(this.props)) ? 'blurry' : ''}`}>
        <Header />
        <LeafletMap />
        <EmbeddedPage />
        <Onboarding />
        <AgeTree />
        { (this.props.activeQuest) ? <Bubble embed={false} /> : null }
        { (isLoggedInAndLoaded(this.props)) ? <Walkthrough ageWalkthrough={isNewAge(this.props.activePlayerData,this.props.journey)} /> : null }
        <AnalyticsProvider />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sid: state.sid,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
    embeddedPage: state.embeddedPage,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
    players: state.players,
    journey: state.journey,
    currentTab: state.currentTab,
    walkthrough: state.walkthrough,
    showcase: state.showcase,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
