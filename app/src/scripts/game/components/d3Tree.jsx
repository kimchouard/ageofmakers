/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Tree from 'react-d3-tree';

import AgeTreePin from './ageTreePin';

class d3Tree extends Component {
  constructor(props){
    super(props)
    this.state = {
      x: 0,
      y: 0
    }
  }
  
  questsToD3Format(quest,quests,parent){
    let questData = quests[quest];
    let questD3 = {
      questData,
      parent,
      "name" : questData.name,
      "children": []
    };
    questData.following.forEach((follower) => {
      let followerD3 = this.questsToD3Format(follower, quests, questData.id);
      questD3.children.push(followerD3);
    });
    return questD3;
  }

  migrateQuests(quests){
    let questD3 = {
      "name" : "Tent",
      "children" : []
    };
    Object.keys(quests).forEach((quest) => {
      let questData = quests[quest];
        if (questData.prerequisites.length === 0) {
          questD3.children.push(this.questsToD3Format(quest, quests))
        }
    })
    return questD3;
  }

  componentDidMount() {
      const dimensions = this.treeContainer.getBoundingClientRect();
      this.setState ({
          x: dimensions.width,
          y: dimensions.height,
      });
  }

  render() {
    let questD3 = this.migrateQuests(this.props.quests);
    return(
      <div className="treeContainer" ref={tc => this.treeContainer = tc}>
        <Tree data={questD3} 
          orientation="vertical" 
          allowForeignObjects
          nodeSvgShape={{shape: 'none'}} 
          zoomable={false} 
          zoom={10}
          collapsible={false}
          styles={{width:  '100%' }}
          separation={{
            siblings: 1,
            nonSiblings: 2
          }}
          nodeLabelComponent={{
            render: ( 
                <AgeTreePin/>
              ),
            foreignObjectWrapper: {
              x: -60,
              y: -75,
              width: 125,
              height: 125
            }
          }} 
          translate={{
            x: this.state.x / 2,
            y: this.state.y / 10
          }}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        quests: state.quests
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(d3Tree);




