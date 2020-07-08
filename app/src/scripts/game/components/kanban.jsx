/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { } from '../../../actions/index';
import { getActiveQuestData } from '../../_utils';
import Board from '@lourenci/react-kanban'


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
    if (this.props.embeddedPage && this.props.activeQuestData) {
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
    embeddedPage: state.embeddedPage,
    activeQuest: state.activeQuest,
    activeQuestData: getActiveQuestData(state),
  };
};

function mapDispatchToProps(dispatch) {
return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Kanban);
