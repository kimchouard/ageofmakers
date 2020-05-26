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
import { getActiveQuestData } from '../../_utils';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';


class Showcase extends Component {
  constructor(props) {
      super(props);

      this.state = {
        chooseSDG: false,
      }
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
    if (this.props.activeQuestData.projects) {
      return this.props.activeQuestData.projects.map((project) => {
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

  startSDGChooser() {
    this.setState({
      chooseSDG: true
    })
  }

  setUserSDG(sdgNumber) {
    console.log('User picked SDG #', sdgNumber);
    // Update the active player with the right SDG #
    this.props.setActivePlayerSDG(sdgNumber);
    // Mark the quest as completed by getting to the next "stage", completing the only fake stage that are in there for projects. 
    this.props.changeStage(this.props.activeQuest.quest, 1);
    this.props.closeEmbeddedQuest();
  }

  renderSDGs() {
    return <div className="col-sm-10 col-sm-offset-1 sdgPickerWrapper">
      { [...Array(16).keys()].map((sdgNumber) => {
        return <div className="SDG-selector col-sm-2" key={sdgNumber} onClick={ () => { this.setUserSDG(sdgNumber + 1) } }>
          <img className="SDG-icon" src={`images/SDGs/TheGlobalGoals_Icons_Color_Goal_${sdgNumber+1}.png`} alt={`SDG ${sdgNumber+1}`} />
        </div>
      }) }
    </div>
  }

  render() {
    if (this.props.embeddedQuest && this.props.activeQuestData) {
      if (this.state.chooseSDG) {
        return <div className="row">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <h1>What Global Goal do you care about?</h1>
              <h4>Based on the projects you're seen, and what you can read on the Global Goals website, click on the global goal you care the most about:</h4>
            </div>
          </div>
          <div className="row">
            { this.renderSDGs() }
          </div>
        </div>
      }
      else {
        return <div className="row">
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <h1>{this.props.activeQuestData.name}</h1>
                <h4>Scroll through the list of what other students have built with the game, and see if there is anything that inspires you! Click "Next" at the bottom of the screen when you're done.</h4>
              </div>
            </div>
            <div className="row">
              { this.renderProjects() }
            </div>
            {(!this.state.chooseSDG) ? <div className={`btn btn-danger ${ (this.props.embeddedQuest.open) ? 'btn-next' : ''}`} onClick={() => { this.startSDGChooser() }}>NEXT</div> : '' }
        </div>
      }
    }
    else {
      return <div>Loading</div>
    }  
  }
}

const mapStateToProps = (state) => {
  return {
    embeddedQuest: state.embeddedQuest,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest, setActivePlayerSDG, changeStage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcase);
