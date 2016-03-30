'use strict';
import React from 'react';

var UhOh = React.createClass({
  displayName: 'UhOh',

  render: function () {
    return (
      <section className='page error-content'>
        <header className='page__header'>
          <div className='inner'>
            <div className='page__headline'>
              <h1 className='page-title'>404 Not found</h1>
            </div>
          </div>
        </header>
        <div className='page__body'>
          <div className='inner'>
            <div className='page__content'>
              <p>Uh-oh, the page you're looking for can't be found!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = UhOh;
