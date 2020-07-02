/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Markdown from './markdown';

class CustomMessage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`aom-${this.props.type}`}>
        <Markdown mdContent={this.props.children} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    journey: state.journey,
  };
};

export default connect(mapStateToProps)(CustomMessage);
