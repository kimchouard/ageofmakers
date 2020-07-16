/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

class BandlabPlayer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <iframe 
      className="bandlabIframe"
      src={ `https://www.bandlab.com/embed/?id=${this.props.musicId}` }
      frameBorder="0"
      allowFullScreen
    />;
  }
}

const mapStateToProps = (state) => {
  return {
    journey: state.journey,
  };
};

export default connect(mapStateToProps)(BandlabPlayer);
