/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { mdRenderers } from '../../_reactUtils';
import yaml from 'js-yaml';
const questsUrl = chrome.runtime.getURL('data/quests.yaml');

export default class List extends Component {
  constructor() {
    super();

    this.state = {
      quests: null
    }
  }

  componentDidMount() {
    fetch(questsUrl)
      .then((response) => {
      if (response.status !== 200) {
        console.error('Error while changing quest state:', res);
        return resolve({ error: response.status });
      }

      // // Examine the text in the response
      response.text().then((questsData) => {
        this.setState({
          quests: yaml.safeLoadAll(questsData)
        });
      });
    });
  }

  getValleyName(valley) {
    if (valley === "ThreeD") {
      return '3D';
    }
    else {
      return valley;
    }
  }

  renderList(list) {
    if (list.length) {
      return <ul>
        {list.map((listItem) => {
          let questItem = this.state.quests.find((quest) => { 
            return quest.id === listItem; 
          });
          console.log('For', listItem, ' found ', questItem);
          return <li>
            { (questItem) ? <a href={`#${questItem.id}`}>{questItem.name}</a> : listItem }
          </li>
        })}
      </ul>
    }
    else {
      return <span>None.<br/></span>
    }
  }

  renderQuestList() {
    if (this.state.quests) {
      return this.state.quests.map((quest) => {
        return <div key={quest.id}>

          <h2 className="title" id={quest.id}>{quest.name}</h2>
          <p>
            <strong>Valley:</strong> <em>{this.getValleyName(quest.valley)}</em><br />
            <strong>Pre-Requesites:</strong> { this.renderList(quest.prerequisites) }
            <strong>Following:</strong> { this.renderList(quest.following) }
            <strong>Start Url:</strong> <a href={quest.startUrl} target="_blank">{quest.startUrl}</a>
          </p>
          <div className="description">
            <ReactMarkdown
              source={quest.content}
              renderers={ mdRenderers }
            />
          </div>
          <div className="stages">
            <h3 class="stagesTitle">Stages</h3>

            {quest.stages.map((stage) => {
              return <div className="stage"  key={stage.order}>
                <h4>{stage.order+1}. {stage.name}</h4>

                <ReactMarkdown
                  source={stage.content}
                  renderers={ mdRenderers }
                />
              </div>
            })}
          </div>
        </div>
      })
    }
    else {
      <div className="text-center">
        <em>Loading...</em>
      </div>
    }
  }

  render() {
    require('../../../sass/list.scss');
    var today = new Date();

    return <div class="contentListWrapper container">
      <div class="row">
        <div class="col-sm">
          <h1 className="header">Game Content</h1>
          <div className="text-center">
            <em className="text-underline">Last updated:</em> {today.toDateString() }
          </div>
      
          { this.renderQuestList() } 
        </div>
      </div>
    </div>
  }
}