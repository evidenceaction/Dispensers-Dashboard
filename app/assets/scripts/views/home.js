'use strict';
import React from 'react';
import { connect } from 'react-redux';
import SectionOverview from '../components/section-stats';
import SectionAccess from '../components/section-access';
import SectionReliability from '../components/section-reliability';
import SectionUsage from '../components/section-usage';
import SectionCarbon from '../components/section-carbon';
import { fetchSection } from '../actions/action-creators';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _fetchSection: React.PropTypes.func,
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

  componentDidMount: function () {
    this.props._fetchSection('overview');
    this.props._fetchSection('access');
    this.props._fetchSection('reliability');
    this.props._fetchSection('usage');
    //this.props._fetchSection('carbon');
  },

  render: function () {
    return (
      <section className='page'>
        <header className='page__header'>
          <div className='inner'>
            <div className='page__headline'>
              <h1 className='page-title'>Home Page</h1>
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
            country='overview'
            data={this.props.sectionAccess.data} />

          <SectionUsage
            fetched={this.props.sectionUsage.fetched}
            fetching={this.props.sectionUsage.fetching}
            country='overview'
            data={this.props.sectionUsage.data} />

          <SectionReliability
            fetched={this.props.sectionReliability.fetched}
            fetching={this.props.sectionReliability.fetching}
            country='overview'
            data={this.props.sectionReliability.data} />

          <SectionCarbon
            fetched={this.props.sectionCarbon.fetched}
            fetching={this.props.sectionCarbon.fetching}
            country='overview'
            data={this.props.sectionCarbon.data} />

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
    _fetchSection: (section) => dispatch(fetchSection(section))
  };
}

module.exports = connect(selector, dispatcher)(Home);
