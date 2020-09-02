/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getActiveQuestData } from '../../_utils';
import { } from '../../../actions/index';
import ResponsivePiano from './responsivePiano';

class MusicTheoryQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { }
  }

  render() {
    if (this.props.question && this.props.activeQuestData) {

      return <div className="musicTheoryQuizWrapper">
        <h4>{ this.props.question.name }</h4>
        

        <ResponsivePiano className="piano" onPlayNoteInput={(midiNote) => {
          console.log("A note has been played!", midiNote);
          
        }} />
      </div>
    }
    else {
      return <div>Loading...</div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    embeddedPage: state.embeddedPage,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicTheoryQuiz);
