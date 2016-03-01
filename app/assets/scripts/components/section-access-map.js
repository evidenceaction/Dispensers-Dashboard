'use strict';
/* global L */
import React from 'react';
import _ from 'lodash';

var SectionAccessMap = React.createClass({
  displayName: 'SectionAccessMap',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    // data: React.PropTypes.shape({
    //   data: React.PropTypes.array,
    //   geo: React.PropTypes.array
    // })
  },

  map: null,
  setupMap: function () {
    this.map = L.mapbox.map(this.refs.map, 'mapbox.streets')
      .setView([0.751362798477074, 34.63918365656846], 4);
  },

  componentDidMount: function () {
    this.setupMap();
  },

  maLayer: null,
  componentDidUpdate: function () {
    if (this.props.data.length) {
      if (!this.maLayer) {
        let feat = {
          type: 'FeatureCollection',
          features: []
        };

        this.props.data.forEach(o => {
          let f = {
            type: 'Feature',
            properties: {
              value: o.value
            },
            geometry: {
              type: 'Point',
              coordinates: o.coordinates
            }
          };
          f.properties.iso = o.iso;
          f.properties.name = o.name;
          feat.features.push(f);
        });

        this.maLayer = L.geoJson(feat, {
          // onEachFeature: (feature, layer) => {
          //   layer.setIcon(L.divIcon({className: 'my-div-icon', html: feature.properties.dispensers_installed}));
          // }
        });
        this.map.addLayer(this.maLayer);
      }

console.log('this.p', this.props.activeDate);
      this.maLayer.eachLayer(l => {
        let props = l.feature.properties;
        
        // if (props.dispensers_installed) {

        // }
        let klass = props.dispensers_installed ? 'my-div-icon active' : 'my-div-icon';
        console.log('klass', klass);
        l.setIcon(L.divIcon({className: klass, html: props.dispensers_installed}));
      });
    }
  },

  render: function () {
    return (
      <div className='map-wrapper'>
        <div ref='map' className='map-container'>{/* Map renders here */}</div>
      </div>
    );
  }
});

module.exports = SectionAccessMap;
