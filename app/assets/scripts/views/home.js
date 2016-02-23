'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';
import d3 from 'd3';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      accessCurrDate: this.startDate
    };
  },

  sliderChangeHandler: function (value) {
    let sartingDate = new Date(this.startDate);
    let nDate = d3.time.day.offset(sartingDate, value);

    this.setState({accessCurrDate: nDate});

    console.log('ndate', nDate);
  },

  startDate: new Date('2014/01/01'),
  endDate: new Date('2015/09/28'),

  computeSliderMax: function () {
    let sTime = this.startDate.getTime() / 1000;
    let eTime = this.endDate.getTime() / 1000;
    return Math.ceil((eTime - sTime) / (60 * 60 * 24));
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

          <section className='page__content section--access'>
            <div className='inner'>
              <div className='col--main'>
                <h1 className='section__title'>Section Title</h1>
                <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
                <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione
                sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>

                <div className='infographic'>A viz of some sort - {d3.time.format('%Y-%m-%d')(this.state.accessCurrDate)}</div>

                <Rcslider
                  onChange={this.sliderChangeHandler}
                  max={this.computeSliderMax()}
                  tipFormatter={null}
                  marks={{
                    0: d3.time.format('%Y-%m-%d')(this.startDate),
                    [this.computeSliderMax()]: d3.time.format('%Y-%m-%d')(this.endDate)
                  }} />

              </div>
              <div className='col--sec'>A viz of some sort</div>
            </div>
          </section>

          <section className='page__content section--usage'>
            <div className='inner'>
              <div className='col--main'>
                <h1 className='section__title'>Section Title</h1>
                <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
                <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione
                sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>
              </div>
              <div className='col--sec'>A viz of some sort</div>
            </div>
          </section>

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
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Home);
