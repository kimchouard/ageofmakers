/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import {connect} from 'react-redux';
import { isLoggedInAndLoaded, getActivePlayerData } from '../../_utils';
import CustomMessage from './customMessage';
import BandlabPlayer from './bandlabPlayer';
import Countdown from './countdown';
import Quiz from './quiz';

class Markdown extends Component {
  constructor(props) {
    super(props);
  }

  returnMdRenderers() {
    return {
      code: ({ language, value }) => {
        if (language === 'warning' || language === 'info') {
          return <CustomMessage type={language}>
            { value }
          </CustomMessage>
        }
    
        if (language === 'bandlab') {
          return <BandlabPlayer musicId={value} />
        }
    
        if (language === 'countdown') {
          return <Countdown minutes={value} />
        }
    
        if (language === 'quizResults') {
          let params = JSON.parse(value);
          console.log('Params', params, this.props.journey.quests[params.questId]);
          if (params && isLoggedInAndLoaded(this.props)) {
            return <Quiz quizData={this.props.journey.quests[params.questId].quiz}  />
          }
        }
    
        // Or default code snippet
        const className = language && `language-${language}`
        const code = React.createElement('code', className ? { className: className } : null, value)
        return React.createElement('pre', {}, code)
      },
      image: ({ src, alt }) => {
        return (
          <img
            alt={alt}
            src={ (src.search('http') === -1) ? chrome.extension.getURL(src) : src }
          />
        );
      }
    }
  }

  render() {
    return <ReactMarkdown
      source={this.props.mdContent}
      renderers={ this.returnMdRenderers() }
    />;
  }
}

const mapStateToProps = (state) => {
  return {
    journey: state.journey,
    players: state.players,
    activePlayer: state.activePlayer,
    activePlayerData: getActivePlayerData(state),
  };
};

export default connect(mapStateToProps)(Markdown);
