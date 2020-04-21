/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {startWalkthrough, closeWelcome} from '../../../actions/index';

class Welcome extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    startWalkthrough(type) {
        this.props.startWalkthrough(type)
        this.props.closeWelcome()
    }

    render() {
        return(
            <div className={ (this.props.welcome.open) ? "welcomeWrapper open" : "welcomeWrapper"}>
                <div className="overlay"></div>
                <div className="welcome">
                    <div className="col-sm-6 welcomeBox">    
                        <h3 className="welcomeTitle">Welcome to the</h3>
                        
                        <div className="row">
                            <span className="moonFlowerFont welcomeTitleSize">AGE OF </span><span className="makerFont welcomeTitleSize"> MAKERS</span>
                        </div>
                        <div className="row">
                            <p className="spacers">Your most glorious quests starts here. Make your dreams a reality by learning how to 3D print, code and use electronics. No time to waste, adventures awaits!</p>
                        </div>
                        <button className="welcomeButton" onClick={this.props.closeWelcome}>Close welcome page</button>
                    </div>
                    <div className="col-sm-6 welcomeBox">    
                        <div className="row welcomeRow">
                            <div>
                                <h4> Quick Start Walkthrough </h4>
                                <p> Guide of how to get started! </p>
                                <button className="goButton" onClick={() => {this.startWalkthrough(1)}}>Go</button>
                            </div>
                        </div>
                        <div className="row welcomeRow">
                            <div>
                            <h4> Profile Page Walkthrough </h4>
                            <p> Have a look at your new profile page!   </p>
                                <button className="goButton" onClick={() => {this.startWalkthrough(2)}}>Go</button>
                            </div>
                        </div>
                        <h4> First Quest Walkthrough </h4>
                        <p> Let's get started with your very first quest!   </p>
                        <div className="row welcomeRow">
                            <div>
                                <button className="goButton" onClick={() => {this.startWalkthrough(3)}}>Go</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      welcome: state.welcome,
    };
  };

function mapDispatchToProps(dispatch) {
    return bindActionCreators({startWalkthrough, closeWelcome}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Welcome);