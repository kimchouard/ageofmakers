/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeShowcase, } from '../../../actions/index';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';


class Showcase extends Component {
  constructor(props) {
      super(props);
  }

  renderTools(project) {
    if (project.using.length) {
      return project.using.map((tool) => {
        return <div className={`col-sm-${12/project.using.length} tool`}>
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
        return <div className="col-md-4">
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
    if (this.props.showcase && this.props.activeQuestData) {
      return (
        <div className={ (this.props.showcase.open) ? 'fullpage open' : 'fullpage'}>
            <div className="wrapper">
                <div className="container">
                    <div className="row">
                        <div className="row">
                          <h1 className="col-sm-12">{this.props.activeQuestData.name}</h1>
                        </div>
                        <div className="row">
                          { this.renderProjects() }
                        </div>
                        <a className="btn btn-danger closingbutton" onClick={() => this.props.closeShowcase()}>CLOSE</a>
                    </div>
                </div>
            </div>
        </div>
      );
    }
    else {
      return <div>Loading</div>
    }  
  }
}

const mapStateToProps = (state) => {
  return {
    showcase: state.showcase,
    activeQuestData: (state.activeQuest) ? state.quests[state.activeQuest.quest] : null,
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeShowcase }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcase);
