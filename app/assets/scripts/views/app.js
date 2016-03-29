'use strict';
import React from 'react';
import GlobalMenu from '../components/global-menu';
import { Link } from 'react-router';

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
              <li><Link to='kenya'>Kenya</Link></li>
              <li><Link to='uganda'>Uganda</Link></li>
              <li><Link to='malawi'>Malawi</Link></li>
            </ul>
            <div>
            <ul className='footer-detail'>
              <li><a href='mailto:info@evidenceaction.org' >Contact Us</a></li>
              <li><p>Safe water © 2016</p></li>
              <li><a href='http://www.evidenceaction.org/privacy-policy/' >Privacy Policy</a></li>
            </ul>
            </div>
          </div>
        </footer>
      </div>
    );
  }
});

module.exports = App;
