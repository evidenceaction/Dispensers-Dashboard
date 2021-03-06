'use strict';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartLine from './charts/chart-line';
import { formatThousands } from '../utils/numbers';

var SectionUsage = React.createClass({
  displayName: 'SectionUsage',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    country: React.PropTypes.string,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      meta: React.PropTypes.object,
      content: React.PropTypes.object
    })
  },

  chartPopoverHandler: function (d, i) {
    return (
      <div className='usage-popover'>
        <p className='popover-date'>{d.values[i].timestep.format('MMM YY')}</p>
        <p className='popover-adoption-rate'>
          {formatThousands(d.values[i].tcr_avg, 1)}%
        </p>
      </div>
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
    let data = {
      values: this.props.data.data.map(o => {
        o = _.cloneDeep(o);
        o.timestep = moment.utc(o.timestep);
        return o;
      })
    };

    return data;
  },

  renderContent: function () {
    let data = this.prepareChartData();
    return (
      <div className='inner'>
        <div className='col--main'>
          <h2 className='section__title'>{this.props.data.content.title}</h2>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />
        </div>
        <div className='col--sec'>
          <div className='infographic'>
          <h4 className='chart-title'>Total Dispenser Adoption Rates </h4>
            <ChartLine
              className='usage-chart-wrapper'
              data={data}
              popoverContentFn={this.chartPopoverHandler} />
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
      <section className='page__content section--usage'>
        {this.props.fetching ? this.renderLoading() : this.renderContent()}
      </section>
    );
  }
});

module.exports = SectionUsage;
