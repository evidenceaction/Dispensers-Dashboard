'use strict';
/* global L */
import React from 'react';
import _ from 'lodash';
import d3 from 'd3';
import { renderToStaticMarkup } from 'react-dom/server';

var SectionAccessMap = React.createClass({
  displayName: 'SectionAccessMap',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    data: React.PropTypes.array,
    activeDate: React.PropTypes.object
  },

  mapCirclesRange: [8, 36],
  mapInitialView: [0.751362798477074, 34.63918365656846],
  mapInitialZoom: 6,

  map: null,
  pointsLayer: null,

  setupMap: function () {
    this.map = L.mapbox.map(this.refs.map, 'mapbox.light', { scrollWheelZoom: false })
      .setView(this.mapInitialView, this.mapInitialZoom);
  },

  setupPointsLayer: function () {
    // Create layer if doesn't exist.
    if (this.pointsLayer) {
      this.map.removeLayer(this.pointsLayer);
    }

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

    this.pointsLayer = L.geoJson(feat);
    this.map.addLayer(this.pointsLayer);

    let { data, activeDate } = this.props;

    // Prepare scale to size circles.
    let min = d3.min(data.map(d => d.values[0].dispensers_total));
    let max = d3.max(data.map(d => _.last(d.values).dispensers_total));

    let scale = d3.scale.linear()
      .domain([min, max])
      .range(this.mapCirclesRange);

    // Class icons accordingly.
    this.pointsLayer.eachLayer(l => {
      let props = l.feature.properties;

      let currentVal = _.find(props.values, {timestep: activeDate.toISOString()});

      let size = scale(currentVal.dispensers_total);
      l.setIcon(L.divIcon({
        iconSize: [size, size],
        className: 'dispenser-point',
        html: renderToStaticMarkup(<div className='dispenser-inner'>&nbsp;</div>)
      }));

      l.bindPopup(renderToStaticMarkup(
        <dl className='map-popover'>
          <dd>Total Dispensers Installed</dd>
          <dt>{currentVal.dispensers_total}</dt>
          <dd>New Dispensers</dd>
          <dt>{currentVal.dispensers_installed}</dt>
        </dl>
      ));

      // Add class on next tick to have the background transition.
      if (currentVal.dispensers_installed) {
        setTimeout(() => {
          if (l._icon) {
            l._icon.classList.add('dispenser-new');
          }
        }, 1);
      }
    });
  },

  componentDidMount: function () {
    this.setupMap();
  },

  componentDidUpdate: function () {
    if (this.props.data.length) {
      this.setupPointsLayer();
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
