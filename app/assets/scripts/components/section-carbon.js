'use strict';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartCarbon from './charts/chart-carbon';
import { formatThousands } from '../utils/numbers';

var SectionCarbon = React.createClass({
  displayName: 'SectionCarbon',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    country: React.PropTypes.string,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      meta: React.PropTypes.array,
      content: React.PropTypes.object
    })
  },

  countryMatrix: [
    {k: 'ke', v: 'Kenya', id: 1},
    {k: 'ug', v: 'Uganda', id: 2},
    {k: 'mw', v: 'Malawi', id: 3}
  ],

  chartPopoverHandler: function (data, index) {
    return (
      <dl className='carbon-popover'>
        {data.map(o => {
          return [
            <dd>{o.country}</dd>,
            <dt className={`country-${o.country.toLowerCase()}`}>{formatThousands(o.values[index].credits, 1)}</dt>
          ];
        })}
      </dl>
    );
  },

  renderLoading: function () {
    return (
      <div className='inner'>
        <p>Data is loading!</p>
      </div>
    );
  },

  prepareChartData: function () {
    let data = _.map(this.props.data.data, o => {
      _.forEach(o.values, oo => {
        oo.timestep = moment.utc(oo.timestep);
      });
      return o;
    });
    return data;
  },

  renderChartKey: function () {
    let c = this.props.country;
    return (
      <ul className='carbon-key'>
        {this.countryMatrix.map(o => {
          let countryLow = o.v.toLowerCase();
          return c === 'overview' || c === countryLow ? <li key={o.k} className={`country-${countryLow}`}>{o.v}</li> : null;
        })}
      </ul>
    );
  },

  renderContent: function () {
    let series = this.prepareChartData();
    let country = this.props.country;

    let certificationMarkers = [];
    if (country === 'overview' || country === 'uganda') {
      certificationMarkers.push({
        timestep: moment.utc('2013-01-01', 'YYYY-MM-DD'),
        value: 'Uganda certified'
      });
    }
    if (country === 'overview' || country === 'malawi') {
      certificationMarkers.push({
        timestep: moment.utc('2014-01-01', 'YYYY-MM-DD'),
        value: 'Malawi certified'
      });
    }
    return (
      <div className='inner'>
        <div className='col--main'>
          <h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />

        </div>
        <div className='col--sec'>
          <div className='infographic'>
          <h4 className='chart-title'>Total Carbon Credits Generated</h4>
            <div className='key'>
              {this.renderChartKey()}
            </div>
            <ChartCarbon
              className='carbon-chart-wrapper'
              popoverContentFn={this.chartPopoverHandler}
              certificationMarkers={certificationMarkers}
              series={series} />
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    return (
      <section className='page__content section--carbon'>
        {this.props.fetching ? this.renderLoading() : this.renderContent()}
      </section>
    );
  }
});

module.exports = SectionCarbon;
