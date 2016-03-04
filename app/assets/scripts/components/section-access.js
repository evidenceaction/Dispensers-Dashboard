'use strict';
import React from 'react';
import Rcslider from 'rc-slider';
import moment from 'moment';
import _ from 'lodash';
import d3 from 'd3';
import classnames from 'classnames';
import ChartArea from './charts/chart-area';
import SectionMap from './section-access-map';

var SectionAccess = React.createClass({
  displayName: 'SectionAccess',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      geo: React.PropTypes.array
    })
  },

  getInitialState: function () {
    return {
      currentSliderPos: 0,
      interval: null
    };
  },

  getStartDate: function () {
    let d = this.props.data.data[0].values[0].timestep;
    return moment.utc(d);
  },

  getEndDate: function () {
    let d = _.last(this.props.data.data[0].values);
    return moment.utc(d);
  },

  play: function () {
    let interval = setInterval(() => {
      let v = this.state.currentSliderPos;
      v = ++v > this.computeSliderMax() ? 0 : v;
      this.setState({currentSliderPos: v, interval});
    }, 300);
  },

  pause: function () {
    if (this.isPlaying()) {
      clearInterval(this.state.interval);
      this.setState({interval: null});
    }
  },

  isPlaying: function () {
    return this.state.interval !== null;
  },

  playToggleHandler: function () {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  },

  wasIntervalRunning: false,
  chartMouseoverHandler: function () {
    if (this.isPlaying()) {
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
            <dt>{o.values[index].new_people_served}</dt>
          ];
        })}
      </dl>
    );
  },

  getCurrentDate: function () {
    let nDate = this.getStartDate().add(this.state.currentSliderPos, 'months');
    return nDate;
  },

  sliderChangeHandler: function (value) {
    this.setState({currentSliderPos: value});
  },

  computeSliderMax: function () {
    let months = this.getEndDate().diff(this.getStartDate(), 'months');
    return months;
  },

  prepareChartData: _.memoize(function () {
    return _(this.props.data.data)
      .groupBy(o => o.iso.substr(0, 2))
      .map((o, key) => {
        // Use he first as base.
        let res = _.cloneDeep(o[0]);
        res.country = key;

        // Loop over all the districts except the first.
        for (let i = 1; i < o.length; i++) {
          // Loop over all the values. Ordered arrays are expected.
          for (let j = 0; j < o[i].values.length; j++) {
            res.values[j].dispenser_total += o[i].values[j].dispenser_total;
            res.values[j].dispensers_installed += o[i].values[j].dispensers_installed;
            res.values[j].new_people_served += o[i].values[j].new_people_served;
            res.values[j].people_total += o[i].values[j].people_total;
          }
        }
        _.forEach(res.values, d => {
          d.timestep = moment.utc(d.timestep);
        });
        return res;
      })
      .value();
  }),

  prepareMapData: _.memoize(function () {
    // Add the values to the geo array.
    let d = this.props.data;
    return d.geo.map(o => {
      let countryData = _.find(d.data, {iso: o.iso});
      o.values = countryData.values;
      return o;
    });
  }),

  renderColFull: function () {
    if (!this.props.fetched) {
      if (this.props.fetching) {
        return (
          <div className='col--full'>
            <p>Data is loading!</p>
          </div>
        );
      }
      return null;
    }

    let currDate = this.getCurrentDate();

    return (
      <div className='col--full'>
        <h1 className='section__title'>Section Title</h1>
        <p>This is a pararaph and goes a little something like this... consectetur adipisicing elit.</p>
        <p>This is another ipsum iste, facere ab consequuntur animi corporis culpa ratione
        sequi quaerat deleniti distinctio ducimus, dolorem possimus, sit blanditiis odio harum quos minus.</p>

          <p className='access-date'>{currDate.format('MM-DD-YYYY')}</p>

        <div className='ui-access-wrapper'>
          <button onClick={this.playToggleHandler}
              className={classnames('slider-animation-button', {'stop': this.isPlaying(), 'play': !this.isPlaying()})}>
              <span>Play/Pause toggle</span>
          </button>

          <div className='slider-wrapper'>
            <Rcslider
              onChange={this.sliderChangeHandler}
              max={this.computeSliderMax()}
              value={this.state.currentSliderPos}
              tipFormatter={null}
              marks={{
                0: this.getStartDate().format('MMM YYYY'),
                [this.computeSliderMax()]: this.getEndDate().format('MMM YYYY')
              }} />
          </div>
        </div>
      </div>
    );
  },

  renderColSec: function () {
    let mapData = [];
    let totalDispensers = null;
    if (this.props.fetched) {
      mapData = this.prepareMapData();

      totalDispensers = _.reduce(this.prepareChartData(), (sum, o) => {
        let currentObj = _.find(o.values, d => d.timestep.toISOString() === this.getCurrentDate().toISOString());
        return sum + currentObj.dispenser_total;
      }, 0);
    }

    return (
      <div className='col--sec'>
      <p className='people-served-total'>{totalDispensers ? d3.format(',d')(totalDispensers) : 'Loading...'} dispensers installed</p>
        <h4 className='chart-title'>Distribution of Dispensers by Country</h4>
        <SectionMap
          activeDate={this.props.fetched ? this.getCurrentDate() : null}
          data={mapData} />
      </div>
    );
  },

  renderColMain: function () {
    if (!this.props.fetched) {
      if (this.props.fetching) {
        return (
          <div className='col--main'>
            <p>Data is loading!</p>
          </div>
        );
      }
      return null;
    }

    let series = this.prepareChartData();
    let totalPeople = _.reduce(this.prepareChartData(), (sum, o) => {
      let currentObj = _.find(o.values, d => d.timestep.toISOString() === this.getCurrentDate().toISOString());
      return sum + currentObj.people_total;
    }, 0);

    return (
      <div className='col--main'>
        <p className='people-served-total'>{d3.format(',d')(totalPeople)} people served</p>
        <h4 className='chart-title'>People Served By Dispensers</h4>
        <div className='infographic'>
          <ChartArea
            mouseover={this.chartMouseoverHandler}
            mouseout={this.chartMouseoutHandler}
            popoverContentFn={this.chartPopoverHandler}
            xHighlight={this.getCurrentDate()}
            className='area-chart-wrapper'
            series={series} />
        </div>
      </div>
    );
  },

  render: function () {
    return (
      <section className='page__content section--access'>
        <div className='inner'>
          {this.renderColFull()}
        </div>

        <div className='inner'>
          {this.renderColMain()}

          {this.renderColSec()}
        </div>
      </section>
    );
  }
});

module.exports = SectionAccess;
