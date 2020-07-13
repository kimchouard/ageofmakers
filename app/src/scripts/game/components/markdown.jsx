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
    
        if (language === 'youtube') {
          return <iframe 
            className="youtubeVideo embedded"
            src={`https://www.youtube.com/embed/${value}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen />
        }
    
        if (language === 'countdown') {
          try {
            let params = JSON.parse(value);

            if (params && params.minutes) {
              return <Countdown minutes={params.minutes} prompts={params.prompts} />
            }
          } catch (e) {
            console.error('Error', e);
            return <p>Error rendering the countdown.</p>
          }
        }
    
        if (language === 'dynamicLinkFromQuestQuiz') {
          try {
            let params = JSON.parse(value);
            if (params && isLoggedInAndLoaded(this.props)) {
              if (params.questionId && this.props.journey.quests[params.questId]) {
                return <p className="text-center">
                  <a href={this.props.journey.quests[params.questId].quiz.results[params.questionId]} target={params.target} className="btn btn-success dynamicLink">{params.label}</a>
                </p>
              }
              else {
                return <p>Error loading the dynamic link.</p>
              }
            }
          } catch (e) {
            console.error('Error', e);
            return <p>Error rendering the dynamic link.</p>
          }
        }
    
        if (language === 'quizResults') {
          try {
            let params = JSON.parse(value);

            if (params.questionId && this.props.journey.quests[params.questId]) {
              return this.props.journey.quests[params.questId].quiz.results[params.questionId];
            }
            else {
              return <Quiz quizData={this.props.journey.quests[params.questId].quiz}  />
            }
          } catch (e) {
            console.error('Error', e);
            return <p>Error rendering the quiz results.</p>
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
