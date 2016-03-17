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

  prepareChartData: _.memoize(function () {
    let data = {
      values: this.props.data.data.map(o => {
        o = _.cloneDeep(o);
        o.timestep = moment.utc(o.timestep);
        return o;
      })
    };

    return data;
  }),

  renderContent: function () {
    let data = this.prepareChartData();
    return (
      <div className='inner'>
        <div className='col--main'>
          <h2 className='section__title'>Adoption</h2>
          {/* <h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} /> */}
          <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
          <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos</p>
        </div>
        <div className='col--sec'>
          <div className='infographic'>
          <h4 className='chart-title'>Total Dispenser Adoption Rates </h4>
            <ChartLine
              className='usage-chart-wrapper'
              data={data}
              topThreshold={this.props.data.meta.tresholds[1].value}
              bottomThreshold={this.props.data.meta.tresholds[0].value}
              popoverContentFn={this.chartPopoverHandler} />
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    console.log('this.prop', this.props);
    if (!this.props.fetched) {
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