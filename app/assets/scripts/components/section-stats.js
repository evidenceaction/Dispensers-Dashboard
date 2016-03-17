'use strict';
import React from 'react';
import { formatThousands } from '../utils/numbers';

var SectionOverview = React.createClass({
  displayName: 'SectionOverview',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    data: React.PropTypes.shape({
      data: React.PropTypes.array
    })
  },

  renderLoading: function () {
    return (
      <p>Data is loading!</p>
    );
  },

  formatStatValue: function (stat) {
    switch (stat.format) {
      case 'percent':
        return formatThousands(stat.value, 1) + '%';
      default:
        return formatThousands(stat.value, 1);
    }
  },

  renderStat: function (stat) {
    return (
      <div className='stats__entry' key={stat.kpi}>
        <h3 className='stats__title'>{this.formatStatValue(stat)}</h3>
        <p className='stats__description'>{stat.descriptionZ}</p>
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    console.log('this', this.props);

    return (
      <section className='page__content section--stats'>
        <div className='inner'>
          <div className='stats__intro'>
            <h1 className='stats__intro-title'>Safe Water Dispensers</h1>
            <p className='stats__intro-text'> Why these KPI's are important, etc. etc. Some Opening text should go here that describes things.</p>
          </div>
          {!this.props.fetched && this.props.fetching ? this.renderLoading() : null}
          {this.props.fetched && !this.props.fetching ? this.props.data.data.map(this.renderStat) : null}
        </div>
      </section>
    );
  }
});

module.exports = SectionOverview;
