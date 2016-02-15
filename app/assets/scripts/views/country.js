'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Country = React.createClass({
  displayName: 'Country',

  propTypes: {
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
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
              <pre>
                {JSON.stringify(this.props.params, null, ' ')}
              </pre>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Country);

