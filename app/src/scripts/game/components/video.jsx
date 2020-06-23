/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeEmbeddedQuest } from '../../../actions/index';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';
/* <ReactMarkdown
    source={contentVariableHere}
    renderers={ mdRenderers }
  /> */


class Video extends Component {
  constructor(props) {
      super(props);
  }

  renderFeatured() {
    if (this.props.activeStageData.featuredChannel) {
      return <div className="featuredYoutubeChannel">
        <img className="channelIcon" src={this.props.activeStageData.featuredChannel.icon} />
        <div className="channelName">{this.props.activeStageData.featuredChannel.name}</div>
        <a className="youtubeButton" href={`https://www.youtube.com/channel/${this.props.activeStageData.featuredChannel.youtubeChannelId}`} target="_blank"></a>
      </div>
    }
  }

  renderVideo() {
    if (this.props.activeStageData.youtubeVideoId) {
      return <iframe 
        className="youtubeVideo"
        src={`https://www.youtube.com/embed/${this.props.activeStageData.youtubeVideoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen />
    }
    else {
      console.error('No youtubeId to show video.');
    }
  }

  render() {
    if (this.props.activeStageData) {
      return <div className="row">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <h1>{this.props.activeStageData.name}</h1>
              <h4>{this.props.activeStageData.content}</h4>
            </div>
          </div>
          <div className="row videoWrapper">
            { this.renderVideo() }
            { this.renderFeatured() }
          </div>
          <div className={`btn btn-danger btn-next`} onClick={() => { this.props.goToNextStage(this.props.activeStageData) }}>NEXT</div>
      </div>
    }
    else {
      return <div>Loading</div>
    }  
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);
