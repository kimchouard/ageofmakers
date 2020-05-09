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
import Board from '@lourenci/react-kanban'
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';
/* <ReactMarkdown
    source={contentVariableHere}
    renderers={ mdRenderers }
  /> */


class Kanban extends Component {
  constructor(props) {
      super(props);

      this.state = {}
  }

  renderKanban() {
    if (this.props.activeQuestData.boards) {
      return <Board initialBoard={ { columns: this.props.activeQuestData.boards }} disableColumnDrag allowAddCard />
    }
    else {
      console.error('No boards to show on the kanban.');
    }
  }

  render() {
    if (this.props.embeddedQuest && this.props.activeQuestData) {
      return <div className="row">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <h1>{this.props.activeQuestData.name}</h1>
              <h4>Explaination here.</h4>
            </div>
          </div>
          <div className="row">
            { this.renderKanban() }
          </div>
      </div>
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
    activeQuestData: (state.activeQuest) ? state.quests[state.activeQuest.quest] : null,
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ closeEmbeddedQuest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Kanban);
