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
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';


class MusicTheoryQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { }
  }

  render() {
    if (this.props.question && this.props.activeQuestData) {
      const firstNote = MidiNumbers.fromNote('c3');
      const lastNote = MidiNumbers.fromNote('f5');
      const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
      });

      return <div className="musicTheoryQuizWrapper">
        <h4>{ this.props.question.name }</h4>
        <p>This is an interactive quiz! :D</p>

        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {
            // Play a given note - see notes below
            console.log('Playing note:', midiNumber);
          }}
          stopNote={(midiNumber) => {
            // Stop playing a given note - see notes below
            console.log('Stop playing note:', midiNumber);
          }}
          width={1000}
          keyboardShortcuts={keyboardShortcuts}
        />
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
