'use strict';
import React from 'react';
import GlobalMenu from '../components/global-menu';

var App = React.createClass({
  displayName: 'App',

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
                <a href='/' title='Visit homepage'>Site title</a>
              </h1>
            </div>
            <GlobalMenu />
          </div>
        </header>

        <main className='site-body' role='main'>
          {this.props.children}
        </main>

        <footer className='site-footer' role='contentinfo'>
          <div className='inner'>
            <ul className='footer-nav'>
              <li><a href=''>Kenya</a></li>
              <li><a href=''>Uganda</a></li>
              <li><a href=''>Malawi</a></li>
            </ul>
          <p className='copy-right'>Safe water © 2016</p>
          </div>
        </footer>
      </div>
    );
  }
});

module.exports = App;
