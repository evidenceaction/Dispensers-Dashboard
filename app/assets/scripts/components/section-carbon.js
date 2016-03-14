'use strict';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChartCarbon from './charts/chart-carbon';

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

  // chartPopoverHandler: function (d, i) {
  //   return (
  //     <div>
  //       <p className='popover-date'>{d.values[i].timestep.format('MM-YYYY')}</p>
  //       <p className='popover-adoption-rate'>
  //         {d.values[i].tcr_avg}
  //       </p>
  //     </div>
  //   );
  // },

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
    let data = this.prepareChartData();
    return (
      <div className='inner'>
        <div className='col--main'>
          <h1 className='section__title'>Adoption</h1>
          {/* <h1 className='section__title'>{this.props.data.content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: this.props.data.content.content}} /> */}

        </div>
        <div className='col--sec'>
          <div className='infographic'>
          <h4 className='chart-title'>Total Dispenser Adoption Rates </h4>
            <ChartCarbon
              className='carbon-chart-wrapper'
              data={data}/>
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
      <section className='page__content section--carbon'>
        {this.props.fetching ? this.renderLoading() : this.renderContent()}
      </section>
    );
  }
});

module.exports = SectionCarbon;
