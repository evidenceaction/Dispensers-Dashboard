'use strict';
import React from 'react';
import { connect } from 'react-redux';
import SectionOverview from '../components/section-stats';
import SectionAccess from '../components/section-access';
import SectionReliability from '../components/section-reliability';
import SectionUsage from '../components/section-usage';
import SectionCarbon from '../components/section-carbon';
import { fetchSection } from '../actions/action-creators';

var Country = React.createClass({
  displayName: 'Country',

  propTypes: {
    _fetchSection: React.PropTypes.func,
    params: React.PropTypes.object,
    sectionOverview: React.PropTypes.shape({
      fetched: React.PropTypes.bool,
      fetching: React.PropTypes.bool,
      data: React.PropTypes.object
    }),
    sectionAccess: React.PropTypes.shape({
      fetched: React.PropTypes.bool,
      fetching: React.PropTypes.bool,
      data: React.PropTypes.object
    }),
    sectionReliability: React.PropTypes.shape({
      fetched: React.PropTypes.bool,
      fetching: React.PropTypes.bool,
      data: React.PropTypes.object
    }),
    sectionUsage: React.PropTypes.shape({
      fetched: React.PropTypes.bool,
      fetching: React.PropTypes.bool,
      data: React.PropTypes.object
    }),
    sectionCarbon: React.PropTypes.shape({
      fetched: React.PropTypes.bool,
      fetching: React.PropTypes.bool,
      data: React.PropTypes.object
    })
  },

  _fetch: function (country) {
    this.props._fetchSection('overview', country);
    this.props._fetchSection('access', country);
    this.props._fetchSection('reliability', country);
    this.props._fetchSection('usage', country);
    this.props._fetchSection('carbon', country);
  },

  componentDidMount: function () {
    this._fetch(this.props.params.country);
  },

  componentWillReceiveProps: function (newProps) {
    if (this.props.params.country !== newProps.params.country) {
      this._fetch(newProps.params.country);
    }
  },

  render: function () {
    return (
      <section className='page'>
        <header className='page__header'>
          <div className='inner'>
            <div className='page__headline'>
              <h1 className='page-title'>{this.props.params.country}</h1>
            </div>
          </div>
        </header>
        <div className='page__body'>

          <SectionOverview
            fetched={this.props.sectionOverview.fetched}
            fetching={this.props.sectionOverview.fetching}
            data={this.props.sectionOverview.data} />

          <SectionAccess
            fetched={this.props.sectionAccess.fetched}
            fetching={this.props.sectionAccess.fetching}
            country={this.props.params.country}
            data={this.props.sectionAccess.data} />

{/*
          <SectionUsage
            fetched={this.props.sectionUsage.fetched}
            fetching={this.props.sectionUsage.fetching}
            data={this.props.sectionUsage.data} />

          <SectionReliability
            fetched={this.props.sectionReliability.fetched}
            fetching={this.props.sectionReliability.fetching}
            data={this.props.sectionReliability.data} />

          <SectionCarbon
            fetched={this.props.sectionCarbon.fetched}
            fetching={this.props.sectionCarbon.fetching}
            data={this.props.sectionCarbon.data} />
*/}
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    sectionOverview: state.sectionOverview,
    sectionAccess: state.sectionAccess,
    sectionReliability: state.sectionReliability,
    sectionUsage: state.sectionUsage,
    sectionCarbon: state.sectionCarbon
  };
}

function dispatcher (dispatch) {
  return {
    _fetchSection: (section, country) => dispatch(fetchSection(section, country))
  };
}

module.exports = connect(selector, dispatcher)(Country);
