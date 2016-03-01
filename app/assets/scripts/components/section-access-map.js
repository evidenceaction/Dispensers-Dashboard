'use strict';
/* global L */
import React from 'react';
import _ from 'lodash';
import d3 from 'd3';

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
              values: o.values
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

      let min = d3.min(this.props.data.map(d => d.values[0].dispenser_total));
      let max = d3.max(this.props.data.map(d => _.last(d.values).dispenser_total));

      let scale = d3.scale.linear()
        .domain([min, max])
        .range([8, 36]);

      let activeDate = this.props.activeDate;

      this.maLayer.eachLayer(l => {
        let props = l.feature.properties;

        let m = _.find(props.values, {timestep: activeDate.toISOString()});

        let klass = m.dispensers_installed ? 'my-div-icon active' : 'my-div-icon';
        console.log('klass', klass);
        l.setIcon(L.divIcon({
          iconSize: [scale(m.dispenser_total), scale(m.dispenser_total)],
          className: klass,
          // html: "<div class='cont'>" + m.dispensers_installed + '</div>'
          html: "<div class='cont'>&nbsp;</div>"
        }));
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
