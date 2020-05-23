/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';

import Pin from './pin';
import { getAge } from '../../_utils';

class AgeTreePin extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if(this.props.nodeData.name === "Tent"){
            let ageData = getAge(this.props.journey);
            return (
                <div className="pinLabelTent">
                    <div className="tent">
                        <img src={ `/images/tent-${ ageData.index + 1 }.png` } className="tent-icon" alt="My Tent"/>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="pinLabelContainer">
                    <div className="pinLabelPin">
                        <Pin nodeData={this.props.nodeData} embedded={true} noBounce noPulse/>
                    </div>
                    <div className="pinLabelText">{this.props.nodeData.name}</div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        journey: state.journey
    };
};

export default connect(mapStateToProps)(AgeTreePin);