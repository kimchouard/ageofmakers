/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeEmbeddedPage, setActivePlayerSDG } from '../../../actions/index';
import { getActiveQuestData, getActivePlayerData } from '../../_utils';
import Markdown from './markdown';



class FTCShowcase extends Component {
  constructor(props) {
      super(props);
  }

  renderTools(project) {
    if (project.using.length) {
      return project.using.map((tool) => {
        return <div className={`col-sm-${12/project.using.length} tool`} key={tool}>
          <img src={`data/ftc/images/tool-${tool}.png`} alt={tool}/>
        </div>
      })
    }
    else {
      return <em>No new technologies, just creativity!</em>
    }
  }

  renderShowcaseItems() {
    if (this.props.activeStageData.showcaseItems) {
      return this.props.activeStageData.showcaseItems.map((project) => {
        return <div className={ `col-md-${(this.props.viewOnly) ? '12' : '4' }` } key={project.order}>
          <div className="project">
            <div className="row title">
              <img className="SDG" src={`data/ftc/images/SDGs/TheGlobalGoals_Icons_Color_Goal_${project.SDG}.png`} alt={`SDG ${project.SDG}`}/>
              <div className="name">{project.name}</div>
            </div>
            <div className="desc">
              <Markdown mdContent={project.content} />

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
      console.error('No showcaseItems to showcase on the current quest.');
    }
  }

  // startSDGChooser() {
  //   this.setState({
  //     chooseSDG: true
  //   })
  // }

  // setUserSDG(sdgNumber) {
  //   console.log('User picked SDG #', sdgNumber);
  //   // Update the active player with the right SDG #
  //   this.props.setActivePlayerSDG(sdgNumber);
  //   // Flagging that we need to finish the quest once the user has been tagged with the right sdg
  //   this.setState({
  //     finishSDGQuest: true,
  //   })

  // }

  // renderSDGs() {
  //   return <div className="col-sm-10 col-sm-offset-1 sdgPickerWrapper">
  //     { [...Array(16).keys()].map((sdgNumber) => {
  //       return <div className="SDG-selector col-sm-2" key={sdgNumber} onClick={ () => { this.setUserSDG(sdgNumber + 1) } }>
  //         <img className="SDG-icon" src={`data/ftc/images/SDGs/TheGlobalGoals_Icons_Color_Goal_${sdgNumber+1}.png`} alt={`SDG ${sdgNumber+1}`} />
  //       </div>
  //     }) }
  //   </div>
  // }

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
        return <div className="row ftcShowcase">
            <div className="row">
              { this.renderShowcaseItems() }
            </div>
            { (!this.props.viewOnly) ? <div className={`btn btn-danger ${ (this.props.embeddedPage.open) ? 'btn-next' : ''}`} onClick={() => { this.props.goToNextStage(this.props.activeStageData) }}>NEXT</div> : '' }
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
    embeddedPage: state.embeddedPage,
    activePlayerData: getActivePlayerData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedPage, setActivePlayerSDG }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FTCShowcase);