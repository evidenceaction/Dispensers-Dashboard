'use strict';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartReliability from './charts/chart-reliability';
import ChartBar from './charts/chart-bar';

var SectionReliability = React.createClass({
  displayName: 'SectionReliability',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      meta: React.PropTypes.array
    })
  },

  chartPopoverHandler: function (d) {
    return (
      <dl>
        <dd>Timestep</dd>
        <dt>{d.timestep.format('YY-MM')}</dt>
        <dd>New dispensers</dd>
        <dt>{d.dispensers_installed || 0}</dt>
        <dd>Total dispensers</dd>
        <dt>{d.dispenser_total}</dt>
        <dd>Outages this timestep</dd>
        <dt>{d.outages.total}</dt>
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
    let data = {
      meta: this.props.data.meta,
      values: this.props.data.data.map(o => {
        o = _.cloneDeep(o);
        o.timestep = moment.utc(o.timestep);
        return o;
      })
    };
    console.log(data)

    return data;
  }),

  renderContent: function () {
    let data = this.prepareChartData();

    return (
      <div className='inner'>
        <div className='col--full'>
          <h1 className='section__title'>Section Title</h1>
          <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
          <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione
          sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>
        </div>
        <div className='col--main'>
          <div className='infographic'>
            <ChartBar
              className='reliability-chart-wrapper'
              data={data}
              popoverContentFn={this.chartPopoverHandler} />
          </div>
        </div>
        <div className='col--sec'>
          <div className='infographic'>
            <ChartReliability
              className='reliability-chart-wrapper'
              data={data}
              popoverContentFn={this.chartPopoverHandler} />
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
      <section className='page__content section--reliability'>
        {this.props.fetching ? this.renderLoading() : this.renderContent()}
      </section>
    );
  }
});

module.exports = SectionReliability;
