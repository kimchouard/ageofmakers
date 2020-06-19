/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeEmbeddedQuest, setActivePlayerSDG, changeStage } from '../../../actions/index';
import { getActiveQuestData, getActivePlayerData } from '../../_utils';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';


class Showcase extends Component {
  constructor(props) {
      super(props);
  }

  renderTools(project) {
    if (project.using.length) {
      return project.using.map((tool) => {
        return <div className={`col-sm-${12/project.using.length} tool`} key={tool}>
          <img src={`images/tool-${tool}.png`} alt={tool}/>
        </div>
      })
    }
    else {
      return <em>No new technologies, just creativity!</em>
    }
  }

  renderProjects() {
    if (this.props.activeStageData.projects) {
      return this.props.activeStageData.projects.map((project) => {
        return <div className="col-md-4" key={project.order}>
          <div className="project">
            <div className="row title">
              <img className="SDG" src={`images/SDGs/TheGlobalGoals_Icons_Color_Goal_${project.SDG}.png`} alt={`SDG ${project.SDG}`}/>
              <div className="name">{project.name}</div>
            </div>
            <div className="desc">
              <ReactMarkdown
                source={project.content}
                renderers={ mdRenderers }
              />

              <div className="from"><strong>From: </strong> {project.from}</div>
            </div>
            <div className="row using">
              { this.renderTools(project) }
            </div>
          </div>
        </div>
      });
    }
    else {
      console.error('No projects to showcase on the current quest.');
    }
  }

  render() {
    if (this.props.activeStageData) {
      // TODO: Remove the SDGs Icons
      // if (this.state.chooseSDG) {
      //   return <div className="row">
      //     <div className="row">
      //       <div className="col-sm-10 col-sm-offset-1">
      //         <h1>What Global Goal do you care about?</h1>
      //         <h4>Based on the projects you're seen, and what you can read on the Global Goals website, click on the global goal you care the most about:</h4>
      //       </div>
      //     </div>
      //     <div className="row">
      //       { this.renderSDGs() }
      //     </div>
      //   </div>
      // }
      // else {
        return <div className="row">
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <h1>{this.props.activeStageData.name}</h1>
                <h4>Scroll through the list of what other students have built with the game, and see if there is anything that inspires you! Click "Next" at the bottom of the screen when you're done.</h4>
              </div>
            </div>
            <div className="row">
              { this.renderProjects() }
            </div>
            <div className={`btn btn-danger ${ (this.props.embeddedQuest.open) ? 'btn-next' : ''}`} onClick={() => { this.props.goToNextStage(this.props.activeStageData) }}>NEXT</div>
        </div>
      // }
    }
    else {
      return <div>Loading</div>
    }  
  }
}

const mapStateToProps = (state) => {
  return {
    embeddedQuest: state.embeddedQuest,
    activePlayerData: getActivePlayerData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest, setActivePlayerSDG, changeStage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcase);
