'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var Home = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func
  },

  render: function () {
    return (
      <section className='page'>
        <header className='page__header'>
          <div className='inner'>
            <div className='page__headline'>
              <h1 className='page-title'>page title</h1>
            </div>
          </div>
        </header>
        <div className='page__body'>
          <div className='inner'>
            <div className='page__content'>

            </div>
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

module.exports = Home;
