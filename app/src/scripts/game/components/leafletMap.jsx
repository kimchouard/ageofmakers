/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Map, Marker, ImageOverlay } from 'react-leaflet';
import {CRS, Icon, divIcon} from 'leaflet';
import { bindActionCreators } from 'redux';
import { questUnlocked, getAge, isLoggedInAndLoaded, getActivePlayerData } from '../../_utils';
import { selectQuest, toggleBubble, openTree, getQuests } from '../../../actions/index';

class Leaflet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 50,
            lng: 50,
            zoom: 4.25,
        }
    }

    componentDidMount() {
      // if(this.props.journey.quests && (this.props.journey.quests.length === 0 || this.props.journey.quests.error)) {
      //   console.log('Loading quests', this.props.getQuests());
      // }
    }

    isUnlocked(quest) {
      return questUnlocked(quest, this.props.journey);
    }

    openQuest(questKey) {
      this.props.toggleBubble(false);
      this.props.selectQuest(questKey);
    }

    renderPins() {
      if (isLoggedInAndLoaded(this.props)) {
        return Object.keys(this.props.journey.quests).map((questKey) => {
          let quest = this.props.journey.quests[questKey];

          if (getAge(this.props.journey).index >= quest.visibleAtAge) {
            let position = [100-quest.positionTop, quest.positionLeft];
            let iconImg = new divIcon({
              iconSize: [50, 65],
              iconAnchor: position,
              html: `<div class='pinWrapper ${quest.status} ${this.isUnlocked(quest) ? `${quest.valley}` : `locked`} ${quest.id}'>
                      <div class='pin bounce'>
                        <div class='inner ${this.isUnlocked(quest) ? `${quest.valley}` : `Locked`}'></div>
                      </div>
                      <div class='pulse'></div>
                    </div>`
            });
            return <Marker
              key={questKey}
              icon={iconImg}
              position={position} 
              onClick={() => this.openQuest(questKey)}
              />
          }
        });
      }
    }

    renderTent() {
      if (isLoggedInAndLoaded(this.props)) {
        let ageData = getAge(this.props.journey);
        return <Marker
          class='tent'
          icon={
            new Icon({
              className:'tent',
              iconUrl: `/images/tent-${ ageData.index + 1 }.png`,
              iconSize: [100,100],
              iconAnchor: [57,35]
            })
          }
          position={[57,35]}
          onClick={this.props.openTree /*openProfile*/ }
          />;
      }
    }

    getMapImageUrl() {
      if (isLoggedInAndLoaded(this.props)) {
        let ageData = getAge(this.props.journey);
        let index = (ageData.index < 2) ? ageData.index : 'all';
        return `${this.props.activePlayerData.journey}-${index}`;
      }
      // Default is first age map #placeholder
      else {
        return 'ftc-0';
      }
    }

    render() {
        let position = [this.state.lat, this.state.lng];
        if(isLoggedInAndLoaded(this.props)) {
          let currentAge = getAge(this.props.journey);
          if (currentAge.position) {
            position = currentAge.position
          }
        }
        
        return (
          <Map
            classname={`leafletMap`}
            style={ { height: `${100*((window.outerHeight - 50)/window.outerHeight)}%`, }}
            center={position}
            zoom={this.state.zoom}
            crs={CRS.Simple}
            attributionControl={false}
            minZoom='3.5'
            maxZoom='5.5'
            zoomSnap='0.25'
            zoomDelta='0.25'>
              <ImageOverlay
                bounds={[[0,0], [100,100]]}
                url={`images/map-${ this.getMapImageUrl() }.jpg`}
              />
              {/* { this.renderTent() } */}
              { this.renderPins() }
          </Map>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      journey: state.journey,
      activePlayer: state.activePlayer,
      activePlayerData: getActivePlayerData(state),
      players: state.players,
    };
  }

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectQuest, toggleBubble, openTree, getQuests }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Leaflet);