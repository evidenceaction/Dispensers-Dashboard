'use strict';
import React from 'react';
import { formatThousands } from '../utils/numbers';

var SectionOverview = React.createClass({
  displayName: 'SectionOverview',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      content: React.PropTypes.object
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
        return formatThousands(stat.value, 0) + '%';
      default:
        return formatThousands(stat.value, 0);
    }
  },

  renderStat: function (stat) {
    return (
      <div className='site-headline' key={stat.kpi}>
        <h7 className='stats__title'>{this.formatStatValue(stat)}</h7>
        <p className='stats__description'>{stat.description}</p>
      </div>
    );
  },

  render: function () {
    if (!this.props.fetched && !this.props.fetching) {
      return null;
    }

    return (
      <section className='page__content section--stats'>
        <div className='inner'>
          {!this.props.fetched && this.props.fetching ? this.renderLoading() : (
          <div className='stats__intro'>
            <h1 className='stats__intro-title'>{this.props.data.content.title}</h1>
            <div className='stats__intro-text' dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />
          </div>
          )}
          {this.props.fetched && !this.props.fetching ? this.props.data.data.map(this.renderStat) : null}
        </div>
      </section>
    );
  }
});

module.exports = SectionOverview;
