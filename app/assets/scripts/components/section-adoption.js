'use strict';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartLine from './charts/chart-line';

var SectionAdoption = React.createClass({
  displayName: 'SectionAdoption',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      meta: React.PropTypes.array,
      content: React.PropTypes.object
    })
  },

  chartPopoverHandler: function (d, i) {
    return (
      <p>{d.values[i].timestep.format('YYYY-MM')} - {d.values[i].adoption}</p>
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

    return data;
  }),

  renderContent: function () {
    // let data = this.prepareChartData();

    let data = {
      values: [
        { timestep: moment.utc('2015-07-01T00:00:00.000Z'), adoption: 10 },
        { timestep: moment.utc('2015-08-01T00:00:00.000Z'), adoption: 20 },
        { timestep: moment.utc('2015-09-01T00:00:00.000Z'), adoption: 80 },
        { timestep: moment.utc('2015-10-01T00:00:00.000Z'), adoption: 50 },
        { timestep: moment.utc('2015-11-01T00:00:00.000Z'), adoption: 60 },
        { timestep: moment.utc('2015-12-01T00:00:00.000Z'), adoption: 75 },
        { timestep: moment.utc('2016-01-01T00:00:00.000Z'), adoption: 70 },
        { timestep: moment.utc('2016-02-01T00:00:00.000Z'), adoption: 91 }
      ]
    };

    return (
      <div className='inner'>
        <div className='col--main'>
          <h1 className='section__title'>Adoption</h1>
          {/*<h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />*/}

        </div>
        <div className='col--sec'>
          <div className='infographic'>
            <ChartLine
              className='adoption-chart-wrapper'
              data={data}
              topThreshold={80}
              bottomThreshold={30}
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
      <section className='page__content section--adoption'>
        {this.props.fetching ? this.renderLoading() : this.renderContent()}
      </section>
    );
  }
});

module.exports = SectionAdoption;
