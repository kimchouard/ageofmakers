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
import { questUnlocked, getAge } from '../../_utils';
import { selectQuest, toggleBubble, openProfile, openTree, getQuests } from '../../../actions/index';

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
      if(this.props.quests && (this.props.quests.length === 0 || this.props.quests.error)) {
        console.log('Loading quests', this.props.getQuests());
      }
    }

    isUnlocked(quest) {
      return questUnlocked(quest, this.props.quests);
    }

    openQuest(questKey) {
      this.props.toggleBubble(false);
      this.props.selectQuest(questKey);
    }

    renderPins() {
      if(this.props.quests) {
        return Object.keys(this.props.quests).map((questKey) => {
          let quest = this.props.quests[questKey];
          let position = [100-quest.positionTop, quest.positionLeft];
          let iconImg = new divIcon({
            iconSize: [50, 65],
            iconAnchor: position,
            html: `<div class='pinWrapper ${quest.status} ${this.isUnlocked(quest) ? `${quest.valley}` : `locked`} ${quest.sfid}'>
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
        });
      }
    }

    render() {
        let ageData = getAge(this.props.quests);
        const position = [this.state.lat, this.state.lng];
        return (
          <Map
            classname='leafletMap'
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
              url='images/map.jpg'
            />
            <Marker
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
            />
            {this.renderPins()}
          </Map>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      quests: state.quests,
    };
  }

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectQuest, toggleBubble, openProfile, openTree, getQuests }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Leaflet);