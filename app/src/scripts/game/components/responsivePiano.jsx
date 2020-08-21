/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import DimensionsProvider from './dimensionsProvider';
import SoundfontProvider from './soundfontProvider';

class ResponsivePiano extends React.Component {
  render() {
    // webkitAudioContext fallback needed to support Safari
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';
    
    const noteRange = {
      first: MidiNumbers.fromNote('c3'),
      last: MidiNumbers.fromNote('f4'),
    };
    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: noteRange.first,
      lastNote: noteRange.last,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <SoundfontProvider
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname={soundfontHostname}
          render={({ isLoading, playNote, stopNote }) => (
            <Piano
              noteRange={noteRange}
              width={containerWidth}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              {...this.props}
            />
          )}
        />
      )}
    </DimensionsProvider>;
  }
}

export default ResponsivePiano;
