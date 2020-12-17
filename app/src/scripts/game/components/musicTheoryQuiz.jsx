/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { MidiNumbers } from 'react-piano';
import { getActiveQuestData } from '../../_utils';
import { } from '../../../actions/index';
import ResponsivePiano from './responsivePiano';

class MusicTheoryQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pianoUsed: false,
      lastNotePlayed: null,
      noteInScale: null,
      selectedKey: 48,
      selectedScale: "major",
      scaleNotes: null,
      colorPiano: false,
      errorRed: '#FF5335',
      successGreen: '#61B136',
      startNote: MidiNumbers.fromNote('c3'),
    }
  }

  componentDidMount() {
    this.createScaleFromKey();
  }

  componentDidUpdate() {
    if (this.state.scaleNotes === null) {
      this.createScaleFromKey();
    }
    else {
      this.colorCodePiano(); 
    }
  }

  getNaturalKeyLetterFromIndex(keyIndex) {
    let aboluteKeyIndex = (keyIndex) % 12;

    switch(aboluteKeyIndex) {
      case 0:
        return 'C';
      case 2:
        return 'D';
      case 4:
        return 'E';
      case 5:
        return 'F';
      case 7:
        return 'G';
      case 9:
        return 'A';
      case 11:
        return 'B';
      default:
        return null
    }
  }

  colorCodePiano() {
    let pianoKeys = document.getElementsByClassName(`ReactPiano__Key`);

    if (pianoKeys && pianoKeys.length === 24) {
      for(let keyIndex = 0; keyIndex < 24; keyIndex++) {
        let pianoKey = pianoKeys[keyIndex];

        if (this.state.colorPiano) {
          // Get ready to add note leters
          var noteDiv = document.createElement("div");
          noteDiv.innerText = this.getNaturalKeyLetterFromIndex(keyIndex);
          noteDiv.className = `note-letter key-${noteDiv.innerText}`;

          // Color the key top
          let scaleResult = this.state.scaleNotes.find((note) => {
            return note === keyIndex + this.state.startNote; // Taking into account that the first C note is indexed at 48
          });

    
          pianoKey.style.borderTopWidth = '2px';
          pianoKey.style.borderTopStyle = 'solid';

          // If the note is OUT of the current scale
          if (scaleResult !== undefined) {
            pianoKey.style.borderTopColor = this.state.successGreen;
            noteDiv.style.color = this.state.successGreen;
          }
          // If the note is IN the current scale
          else {
            pianoKey.style.borderTopColor = this.state.errorRed;
            noteDiv.style.color = this.state.errorRed;
          }

          let noteLetterDiv = pianoKey.getElementsByClassName('note-letter');
          // If there is not a letter shown alread and it's a natural key (not an accidental)
          if (noteLetterDiv && noteLetterDiv.length === 0 && this.getNaturalKeyLetterFromIndex(keyIndex)) {
            pianoKey.appendChild(noteDiv);
          }
        }
        else {
          pianoKey.style.borderColor = null;
          pianoKey.style.borderTopWidth = null;
          pianoKey.style.borderTopStyle = null;
          let noteLetterDiv = pianoKey.getElementsByClassName('note-letter');
          if (noteLetterDiv && noteLetterDiv.length) {
            noteLetterDiv[0].remove();
          }
        }
      }
    }
  }

  colorCodePianoKey(keyIndex, inKey) {
    let pianoKeys = document.getElementsByClassName(`ReactPiano__Key`);
    if (pianoKeys && pianoKeys.length === 24 && keyIndex >= this.state.startNote && keyIndex < this.state.startNote + pianoKeys.length) {
      pianoKeys[keyIndex - this.state.startNote].style.background = (inKey === undefined) ? null : (inKey === true) ? this.state.successGreen : this.state.errorRed;
    }
  }

  isWholeOrHalfNote(scaleIndex) {
    return (this.state.selectedScale == 'major' && (scaleIndex == 2 || scaleIndex == 6)) || (this.state.selectedScale == 'minor' && (scaleIndex == 1 || scaleIndex == 4))
  }

  createScaleFromKey() {
    if(this.state.selectedKey && this.state.selectedScale){
      let scaleNotes = [this.state.selectedKey - 12];
      for (let octaveIndex = 0; octaveIndex < 3; octaveIndex++) {
        for (let scaleIndex = 0; scaleIndex < 7; scaleIndex++) {
          let lastNoteCalculated = scaleNotes[scaleNotes.length - 1];
          // If its half a note
          if (this.isWholeOrHalfNote(scaleIndex)){
            scaleNotes.push(lastNoteCalculated + 1);
          }
          // If it is a whole note
          else{ 
            scaleNotes.push(lastNoteCalculated + 2);
          }
        }
      }
      console.log(scaleNotes);
      // return scaleNotes;

      this.setState({
        scaleNotes,
      });
    }
    // Using: this.state.selectedKey
    // With the WWHWWWH (W = +2 / H = +1)
  }

  notePlayed(midiNote) {
    console.log('Check note', midiNote, 'against the key', this.state.selectedKey);

    if (this.state.scaleNotes) {
      let scaleResult = this.state.scaleNotes.find((note) => {
        return note === midiNote;
      });

      // If it's the first time we use the piano, we mark this question as completed.
      if (!this.pianoUsed) {
        this.props.musicQuizCompleted();
      }
  
      if (scaleResult !== undefined) {
        console.log("The note is in the scale", midiNote);
        this.colorCodePianoKey(midiNote, true);
        this.setState({
          lastNotePlayed: midiNote,
          noteInScale: true,
          pianoUsed: true,
        });
      }
      else {
        console.log("The note is out of scale", midiNote);
        this.colorCodePianoKey(midiNote, false);
        this.setState({
          lastNotePlayed: midiNote,
          noteInScale: false,
          pianoUsed: true,
        });
      }
    }
    else {
      console.error('Scale notes not calculated!');
    }
  }

  noteStopPlayed(midiNote) {
    console.log('Reseting note', midiNote);
    this.colorCodePianoKey(midiNote);
  }

  renderNoteResult() {
    if (this.state.lastNotePlayed === null) {
      return <p className="text-center guides">Click on any key to get started, or use your keyboard and the letter shown in the piano.</p>;
    }
    else {
      if (this.state.noteInScale) {
        return <p className="text-center guides text-success">Good job! This note is in the selected {this.state.selectedScale} scale.</p>
      }
      else {
        return <p className="text-center guides text-danger">Oops! This note is not in the selected {this.state.selectedScale} scale.</p>
      }
    }
  }

  render() {
    if (this.props.question && this.props.activeQuestData) {

      return <div className="musicTheoryQuizWrapper">
        <h4>{ this.props.question.name }</h4>
        <div className="form-inline questionLabels">
          <div className="form-group">
            <label htmlFor="key">Try to find the notes for the Key of </label>
            <select 
              className="form-control"
              name="key"
              value={this.state.selectedKey}
              onChange={(event) => { this.setState({selectedKey: parseInt(event.target.value), scaleNotes: null}) }}
            >
              <option value={45}>A</option>
              <option value={47}>B</option>
              <option value={48}>C</option>
              <option value={50}>D</option>
              <option value={52}>E</option>
              <option value={53}>F</option>
              <option value={55}>G</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="scale"> in the </label>
            <select 
              className="form-control"
              name="scale"
              value={this.state.selectedScale}
              onChange={(event) => { this.setState({selectedScale: event.target.value, scaleNotes: null}) }}
            >
              <option value="major">Major scale</option>
              <option value="minor">Minor scale</option>
            </select>
          </div>
        </div>
        
        { this.renderNoteResult() }

        <ResponsivePiano 
          className="piano"
          onPlayNoteInput={(midiNote) => { this.notePlayed(midiNote); }}
          onStopNoteInput={(midiNote) => { this.noteStopPlayed(midiNote); }}
        />

        <div className="quizQuestionHelper">
          <div className="helpersContent" style={ {
            height: (this.state.colorPiano) ? 'auto' : 0
          }}>
            <p className="text-center">{`The formula for the ${this.state.selectedScale} scale is ${(this.state.selectedScale === 'major' ? 'W-W-H-W-W-W-H' : 'W-H-W-W-H-W-W')}.`}</p>
          </div>
          <div className="helpersToggle">
            <div className="btn btn-dark btn-sm" onClick={ () => { this.setState({ colorPiano: !this.state.colorPiano }) }}>
              { (this.state.colorPiano) ? 'Disable the help' : 'Need more help finding the right notes?' }
            </div>
          </div>
        </div>
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
