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
import { questTypes, getActiveQuestData } from '../../_utils';
import Showcase from './showcase';
import Kanban from './kanban';

class EmbeddedQuest extends Component {
  constructor(props) {
      super(props);

      this.state = {}
  }

  renderEmbbededQuestContent() {
    if (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.SHOWCASE) {
      return <Showcase />;
    }
    else if (this.props.activeQuestData && this.props.activeQuestData.type === questTypes.KANBAN) {
      return <Kanban />
    }
  }

  render() {
    if (this.props.embeddedQuest && this.props.activeQuestData) {
      return (
        <div className={ (this.props.embeddedQuest.open) ? 'fullpage open' : 'fullpage'}>
            <div className="wrapper">
                <div className="container">
                    { this.renderEmbbededQuestContent() }
                </div>
                <a className="btn btn-danger btn-close" onClick={() => this.props.closeEmbeddedQuest()}>CLOSE</a>
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
    embeddedQuest: state.embeddedQuest,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbeddedQuest);
