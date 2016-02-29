'use strict';
import React from 'react';
// import moment from 'moment';
import ChartReliability from './charts/chart-reliability';

var SectionReliability = React.createClass({
  displayName: 'SectionReliability',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool
  },

  chartPopoverHandler: function (data, index) {
    return (
      <dl>
        {data.map(o => {
          return [
            <dd>{o.country}</dd>,
            <dt>{o.values[index].value}</dt>
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

  renderContent: function () {
    let data = {
      values: [
        { date: new Date('2014/01/01'), installed: 1000, outages: 40 },
        { date: new Date('2014/02/01'), installed: 2000, outages: 100 },
        { date: new Date('2014/03/01'), installed: 2200, outages: 20 },
        { date: new Date('2014/04/01'), installed: 2700, outages: 168 },
        { date: new Date('2014/05/01'), installed: 3000, outages: 74 }
      ]
    };

    // for (var i = 0; i < 12; i++) {
    //   data.values.push(
    //     { date: moment(data.values[data.values.length - 1].date).add(1, 'month').toDate(), installed: data.values[data.values.length - 1].installed + Math.floor(Math.random() * 500), outages: Math.floor(Math.random() * 500) }
    //   );
    // }

    return (
      <div className='inner'>
        <div className='col--main'>
          <h1 className='section__title'>Section Title</h1>
          <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
          <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione
          sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>
        </div>
        <div className='col--sec'>
          <div className='infographic'>
            <ChartReliability
              className='reliability-chart-wrapper'
              data={data} />
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
