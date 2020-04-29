/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
// import { closeProfile, getQuests, selectQuest, toggleBubble,  } from '../../../actions/index';
import { questUnlocked, addComplete} from '../../_utils';


class Profile extends Component {
  constructor(props) {
      super(props);
  }

  isUnlocked(quest) {
    return questUnlocked(quest, this.props.quests);
  }

  openQuest(questId) {
    this.props.toggleBubble(false);
    this.props.selectQuest(questId);
  }

  closeProfile() {
    this.props.closeProfile();
  }


  obtainCompleteStages(questId) {
    let numberOfStagesComplete = 0
    this.props.quests[questId].stages.map( (stageId) => {
        if (stageId.status === "complete"){
          numberOfStagesComplete = numberOfStagesComplete + 1
        }
    });
    return numberOfStagesComplete
  }


  renderRawList (questId, isUpNext) {
    let percentPortion = 1 / this.props.quests[questId].stages.length
    let percentComplete = percentPortion * this.obtainCompleteStages(questId)
    if (`${percentComplete}`=== "NaN") {
      percentComplete = 0
    }
    let strokeDashOffsetValue = 100 - (percentComplete * 100);
    let barColor = 'green'
    if ((percentComplete * 100) <= 33.3) {
      barColor = 'red'
    } else if ((percentComplete * 100) <= 66.6){
      barColor = 'yellow'
    }
    let styleAmount = {
      'stroke' : barColor,
      'strokeDashoffset' : strokeDashOffsetValue,
    }
    let badgeImg = {
      // 'backgroundImage': `url(/images/badges-${this.props.quests[questId].sfid}.png)`,
      'filter' : `grayscale(${Math.floor(percentComplete*100)}%)`,
      'Webkitfilter' : `grayscale(${100 - (Math.floor(percentComplete*100))}%)`,
    }
    if (this.props.quests[questId].positionLeft > 0){
    return (
      <div className="col-sm-2 badgeContainer" key={this.props.quests[questId].sfid}>
        <div className="badge" onClick={() => this.openQuest(questId)}>
          <div className={ (isUpNext) ? `content img-upnext` : "content"} onClick={() => this.openQuest(questId)} style={badgeImg}></div>
          <svg className="progress-bar" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 34 34">
            <circle cx="16" cy="16" r="15.9155" className='img-circle progress-bar__background' onClick={() => this.openQuest(questId)}/>
            <circle cx="16" cy="16" r="15.9155" className="progress-bar__progress js-progress-bar" style={styleAmount} onClick={() => this.openQuest(questId)}/>
        </svg>
        </div>
        <h3 className={ (isUpNext) ? 'upnext' : ''}>{this.props.quests[questId].name}</h3>
        <p>{Math.floor(percentComplete*100)}% Complete!</p>      
      </div>
    )
  }
  }

  

  renderList (valleyName) {
    return Object.keys(this.props.quests).map( (questId) => {
      if (this.isUnlocked(this.props.quests[questId]) && this.props.quests[questId].status === 'complete' && this.props.quests[questId].valley === valleyName) {
        return this.renderRawList(questId, false);
      }
    });
  }
  
  renderUpNextList (valleyName) {
    return Object.keys(this.props.quests).map( (questId) => {
      if (this.isUnlocked(this.props.quests[questId]) && this.props.quests[questId].status !== 'complete' && this.props.quests[questId].valley === valleyName) {
        return this.renderRawList(questId, true);
      }
    });
  }

  render() {
    if (this.props.quests === 0){
      return <div>Loading</div>
    } else {
    return (
      <div>
        <div className={ (this.props.profile.open) ? 'fullpage open' : 'fullpage'}>
            <div className="wrapper">
                <div className="container">
                    <div className="row">
                        <div className="row">
                          <h1 className="col-sm-6 profileName">Hello {this.props.player.name}!</h1>
                          <h2 className="col-sm-6 questsBeat">You beat {addComplete(this.props.quests, null)} quest(s)!</h2>
                        </div>
                        <h2 className="codingName">Coding Valley:</h2>
                        <div className="row codingBadges">
                          {this.renderList("Coding")}
                          {this.renderUpNextList("Coding")}
                        </div>
                        <h2>Maker Mount:</h2>
                        <div className="row">
                          {this.renderList("MakerMount")}
                          {this.renderUpNextList("MakerMount")}
                        </div>
                        <h2>3D Valley:</h2>
                        <div className="row">
                          {this.renderList("ThreeD")}
                          {this.renderUpNextList("ThreeD")}
                        </div>
                        <h2>Electro Valley:</h2>
                        <div className="row">
                          {this.renderList("Electronics")}
                          {this.renderUpNextList("Electronics")}
                        </div>
                        <a className="btn btn-danger closingbutton" onClick={() => this.closeProfile()}>CLOSE</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );}
  }
}

const mapStateToProps = (state) => {
  return {
    sid: state.sid,
    player: state.player,
    quests: state.quests,
    profile: state.profile 
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ /* closeProfile, getQuests, selectQuest, toggleBubble */ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
