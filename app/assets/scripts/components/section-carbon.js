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
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      meta: React.PropTypes.array,
      content: React.PropTypes.object
    })
  },

  chartPopoverHandler: function (data, index) {
    return (
      <dl className='carbon-popover'>
        {data.map(o => {
          return [
            <dd>{o.country}</dd>,
            <dt>{formatThousands(o.values[index].credits, 1)}</dt>
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

  prepareChartData: _.memoize(function () {
    let data = _.map(this.props.data.data, o => {
      _.forEach(o.values, oo => {
        oo.timestep = moment.utc(oo.timestep);
      });
      return o;
    });
    return data;
  }),

  renderContent: function () {
    let series = this.prepareChartData();
    return (
      <div className='inner'>
        <div className='col--main'>
          <h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />

        </div>
        <div className='col--sec'>
          <div className='infographic'>
          <h4 className='chart-title'>Total Dispenser Carbon Credits</h4>
            <ChartCarbon
              className='carbon-chart-wrapper'
              popoverContentFn={this.chartPopoverHandler}
              series={series} />
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched) {
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