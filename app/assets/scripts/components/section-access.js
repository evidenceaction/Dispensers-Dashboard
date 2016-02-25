'use strict';
/* global L */
import React from 'react';
import Rcslider from 'rc-slider';
import moment from 'moment';
import ChartArea from './charts/chart-area';

var SectionAccess = React.createClass({
  displayName: 'SectionAccess',

  propTypes: {
    dispatch: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      currentSliderPos: 0
    };
  },

  getStartData: function () {
    return moment('2014/01/01', 'YYYY-MM-DD');
  },

  getEndData: function () {
    return moment('2014/05/01', 'YYYY-MM-DD');
  },

  interval: null,
  play: function () {
    this.interval = setInterval(() => {
      let v = this.state.currentSliderPos;
      v = ++v > this.computeSliderMax() ? 0 : v;
      this.setState({currentSliderPos: v});
    }, 300);
  },

  pause: function () {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },

  playToggleHandler: function () {
    if (this.interval) {
      this.pause();
    } else {
      this.play();
    }
  },

  wasIntervalRunning: false,
  chartMouseoverHandler: function () {
    if (this.interval) {
      this.wasIntervalRunning = true;
    }
    this.pause();
  },

  chartMouseoutHandler: function () {
    if (this.wasIntervalRunning) {
      this.wasIntervalRunning = false;
      this.play();
    }
  },

  chartPopoverHandler: function (data, index) {
    return (
      <dl>
        {data.map(o => {
          return [
            <dd>{o.country}</dd>,
            <dt>{o.values[index].value}</dt>
          ];
        })}
      </dl>
    );
  },

  getCurrentDate: function () {
    let nDate = this.getStartData().add(this.state.currentSliderPos, 'months');
    return nDate;
  },

  sliderChangeHandler: function (value) {
    this.setState({currentSliderPos: value});
  },

  computeSliderMax: function () {
    let months = this.getEndData().diff(this.getStartData(), 'months');
    return months;
  },

  componentDidMount: function () {
    L.mapbox.map(this.refs.map, 'mapbox.streets')
      .setView([40, -74.50], 9);
  },

  render: function () {
    let series = [
      {
        country: 'uganda',
        values: [
          { date: new Date('2014/01/01'), value: 10, cumulative: 10 },
          { date: new Date('2014/02/01'), value: 20, cumulative: 30 },
          { date: new Date('2014/03/01'), value: 2, cumulative: 32 },
          { date: new Date('2014/04/01'), value: 20, cumulative: 52 },
          { date: new Date('2014/05/01'), value: 22, cumulative: 74 }
        ]
      },

      {
        country: 'malawi',
        values: [
          { date: new Date('2014/01/01'), value: 60, cumulative: 60 },
          { date: new Date('2014/02/01'), value: 84, cumulative: 144 },
          { date: new Date('2014/03/01'), value: 22, cumulative: 166 },
          { date: new Date('2014/04/01'), value: 55, cumulative: 221 },
          { date: new Date('2014/05/01'), value: 30, cumulative: 251 }
        ]
      },

      {
        country: 'kenya',
        values: [
          { date: new Date('2014/01/01'), value: 1, cumulative: 1 },
          { date: new Date('2014/02/01'), value: 0, cumulative: 1 },
          { date: new Date('2014/03/01'), value: 4, cumulative: 5 },
          { date: new Date('2014/04/01'), value: 15, cumulative: 20 },
          { date: new Date('2014/05/01'), value: 40, cumulative: 60 }
        ]
      }
    ];

    return (
      <section className='page__content section--access'>
        <div className='inner'>
          <div className='col--main'>
            <h1 className='section__title'>Section Title</h1>
            <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
            <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione
            sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>

            <button onClick={this.playToggleHandler}>play toggle</button>

            <div className='infographic'>
              <ChartArea
                mouseover={this.chartMouseoverHandler}
                mouseout={this.chartMouseoutHandler}
                popoverContentFn={this.chartPopoverHandler}
                xHighlight={this.getCurrentDate().toDate()}
                className='area-chart-wrapper'
                series={series} />
            </div>
            <div>date -- {this.getCurrentDate().format('YYYY-MM-DD')}</div>

            <Rcslider
              onChange={this.sliderChangeHandler}
              max={this.computeSliderMax()}
              value={this.state.currentSliderPos}
              tipFormatter={null}
              marks={{
                0: this.getStartData().format('YYYY-MM-DD'),
                [this.computeSliderMax()]: this.getEndData().format('YYYY-MM-DD')
              }} />

          </div>
          <div className='col--sec'>
            <div className='map-wrapper'>
              <div ref='map' className='map-container'>{/* Map renders here */}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = SectionAccess;
