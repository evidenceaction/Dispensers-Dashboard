'use strict';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartLine from './charts/chart-line';

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
      <div>{d.values[i].timestep.format('YYYY-MM')}
        <pre>{JSON.stringify(d.values[i], null, 2)}</pre>
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
          <h1 className='section__title'>Adoption</h1>
          {/*<h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />*/}

        </div>
        <div className='col--sec'>
          <div className='infographic'>
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
