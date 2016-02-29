'use strict';
import React from 'react';
import { connect } from 'react-redux';
import SectionAccess from '../components/section-access';
import SectionReliability from '../components/section-reliability';
import { fetchSectionAccess } from '../actions/action-creators';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _fetchSectionAccess: React.PropTypes.func,
    sectionAccess: React.PropTypes.shape({
      fetched: React.PropTypes.bool,
      fetching: React.PropTypes.bool,
      data: React.PropTypes.object
    })
  },

  componentDidMount: function () {
    this.props._fetchSectionAccess();
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

          <SectionAccess
            fetched={this.props.sectionAccess.fetched}
            fetching={this.props.sectionAccess.fetching}
            data={this.props.sectionAccess.data} />

          <SectionReliability
            fetched
            fetching />

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
    sectionAccess: state.sectionAccess
  };
}

function dispatcher (dispatch) {
  return {
    _fetchSectionAccess: () => dispatch(fetchSectionAccess())
  };
}

module.exports = connect(selector, dispatcher)(Home);
