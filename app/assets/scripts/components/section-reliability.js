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
      meta: React.PropTypes.array,
      content: React.PropTypes.object
    })
  },

  totalChartPopoverHandler: function (d) {
    return (
      <dl className='reliability-popover-total'>
        <dd>{d.timestep.format('MMM YY')}</dd>
        <dd>Functioning Dispensers</dd>
        <dt>{Math.round(d.functional.total_rate) + '%'}</dt>
        <dd>Dispensers with Reported Outage</dd>
        <dt>{Math.round(d.outages.total_rate) + '%'}</dt>
      </dl>
    );
  },

  breakdownChartPopoverHandler: function (d) {
    return (
      <dl className='reliability-popover-breakdown'>
        <dd>{d.timestep.format('MMM YY')}</dd>
        <dd>Total Dispensers with Reported Outages</dd>
        <dt>{d.outages.total || 0}</dt>
        <dd>Chlorine Outages</dd>
        <dt>{Math.round(d.outages.chlorine_rate) + '%'}</dt>
        <dd>Hardware Ourages</dd>
        <dt>{Math.round(d.outages.hardware_rate) + '%'}</dt>
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
          <h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />
        </div>
        <div className='col--main'>
          <h4 className='chart-title'>Percent of Functional Dispensers</h4>
          <div className='infographic'>
            <div className='key'>
              <ul className='reliability-key-total'>
                <li>Functional Dispensers (%)</li>
                <li>Dispensers with Reported Outages (%)</li>
              </ul>
            </div>
            <ChartBar
              className='reliability-chart-wrapper'
              data={data}
              popoverContentFn={this.totalChartPopoverHandler} />
          </div>
        </div>
        <div className='col--sec'>
          <h4 className='chart-title'>Breakdown of Reported Dispenser Outages</h4>
          <div className='infographic'>
            <div className='key'>
              <ul className='reliability-key-breakdown'>
                <li>% of dispensers with reported chlorine outages</li>
                <li>% of dispensers with reported hardware outages</li>
              </ul>
            </div>
            <ChartReliability
              className='reliability-chart-wrapper'
              data={data}
              popoverContentFn={this.breakdownChartPopoverHandler} />
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
