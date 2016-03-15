'use strict';
import React from 'react';
import { connect } from 'react-redux';
import SectionAccess from '../components/section-access';
import SectionReliability from '../components/section-reliability';
import SectionUsage from '../components/section-usage';
import SectionCarbon from '../components/section-carbon';
import { fetchSectionAccess, fetchSectionReliability, fetchSectionUsage, fetchSectionCarbon} from '../actions/action-creators';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _fetchSectionAccess: React.PropTypes.func,
    _fetchSectionReliability: React.PropTypes.func,
    _fetchSectionUsage: React.PropTypes.func,
    _fetchSectionCarbon: React.PropTypes.func,
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
    this.props._fetchSectionAccess();
    this.props._fetchSectionReliability();
    this.props._fetchSectionUsage();
    this.props._fetchSectionCarbon();
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

          <section className='page__content section--stats'>
            <div className='inner'>
              <h1 className='section__title'>Stats</h1>
              <div className='stats__intro'>
                <h1 className='stats__intro-title'> Safe Water Dispensers </h1>
                <p className='stats__intro-text'> Why these KPI's are important, etc. etc. Some Opening text should go here that describes things.</p>
              </div>
              <div className='stats__entry'>
                <h2 className='stats__title'>52!<small>seconds</small></h2>
                <p className='stats__description'>A number so unfathomably big that's impossible to put in perspective.</p>
              </div>
              <div className='stats__entry'>
                <h2 className='stats__title'>3.1415926<small>Some pie</small></h2>
                <p className='stats__description'>The flavor... pie flavor</p>
              </div>
              <div className='stats__entry'>
                <h2 className='stats__title'>100.000.000<small>Title</small></h2>
                <p className='stats__description'>That's a lot of zeros, and a poor one at the front</p>
              </div>
              <div className='stats__entry'>
                <h2 className='stats__title'>159<small>Title</small></h2>
                <p className='stats__description'>I just need a somewhat long sentence to see what happens to this text.</p>
              </div>
            </div>
          </section>

          <SectionCarbon
            fetched={this.props.sectionCarbon.fetched}
            fetching={this.props.sectionCarbon.fetching}
            data={this.props.sectionCarbon.data} />

          <SectionAccess
            fetched={this.props.sectionAccess.fetched}
            fetching={this.props.sectionAccess.fetching}
            data={this.props.sectionAccess.data} />

          <SectionUsage
            fetched={this.props.sectionUsage.fetched}
            fetching={this.props.sectionUsage.fetching}
            data={this.props.sectionUsage.data} />

          <SectionReliability
            fetched={this.props.sectionReliability.fetched}
            fetching={this.props.sectionReliability.fetching}
            data={this.props.sectionReliability.data} />

          <section className='page__content section--carbon'>
            <div className='inner'>
              <div className='col--main'>
                <h1 className='section__title'>Section Title</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Ipsum iste, facere ab consequuntur animi corporis culpa ratione
                sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>
              </div>
              <div className='col--sec'>A viz of some sort</div>
            </div>
          </section>

        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    sectionAccess: state.sectionAccess,
    sectionReliability: state.sectionReliability,
    sectionUsage: state.sectionUsage,
    sectionCarbon: state.sectionCarbon
  };
}

function dispatcher (dispatch) {
  return {
    _fetchSectionAccess: () => dispatch(fetchSectionAccess()),
    _fetchSectionReliability: () => dispatch(fetchSectionReliability()),
    _fetchSectionUsage: () => dispatch(fetchSectionUsage()),
    _fetchSectionCarbon: () => dispatch(fetchSectionCarbon())
  };
}

module.exports = connect(selector, dispatcher)(Home);
