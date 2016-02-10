'use strict';
import React from 'react';

var App = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div>
        <header className='site-header' role='banner'>
          <div className='inner'>
            <div className='site-headline'>
              <h1 className='site-title'>
                <a href='/' title='Visit homepage'>
                  <span>Site title</span>
                </a>
              </h1>
            </div>
          </div>
        </header>

        <main className='site-body' role='main'>
          <div className='inner'>
            {this.props.children}
          </div>
        </main>

        <footer className='site-footer' role='contentinfo'>
          <div className='inner'>
            <p>Safe water © 2016</p>
          </div>
        </footer>
      </div>
    );
  }
});

module.exports = App;
