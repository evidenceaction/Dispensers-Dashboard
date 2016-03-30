'use strict';
import React from 'react';
import Rcslider from 'rc-slider';
import moment from 'moment';
import _ from 'lodash';
import d3 from 'd3';
import classnames from 'classnames';
import ChartArea from './charts/chart-area';
import SectionMap from './section-access-map';
import { formatThousands } from '../utils/numbers';

var SectionAccess = React.createClass({
  displayName: 'SectionAccess',

  propTypes: {
    fetched: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    country: React.PropTypes.string,
    data: React.PropTypes.shape({
      data: React.PropTypes.array,
      geo: React.PropTypes.array,
      content: React.PropTypes.object
    })
  },

  countryMatrix: [
    {k: 'ke', v: 'Kenya', id: 1},
    {k: 'ug', v: 'Uganda', id: 2},
    {k: 'mw', v: 'Malawi', id: 3}
  ],

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
      <dl className='access-popover'>
        {data.map(o => {
          return [
            <dd>{o.country}</dd>,
            <dt className={`country-${o.country.toLowerCase()}`}>{formatThousands(o.values[index].people_total)} ({formatThousands(o.values[index].new_people_served)} new)</dt>
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

  prepareChartData: function () {
    return _(this.props.data.data)
      .groupBy(o => o.iso.substr(0, 2))
      .map((o, key) => {
        // Use the first as base.
        let res = _.cloneDeep(o[0]);
        let c = _.find(this.countryMatrix, {k: key.toLowerCase()});
        res.country = c.v;
        res.id = c.id;
        delete res.iso;

        // Loop over all the districts except the first.
        for (let i = 1; i < o.length; i++) {
          // Loop over all the values. Ordered arrays are expected.
          for (let j = 0; j < o[i].values.length; j++) {
            res.values[j].dispensers_total += o[i].values[j].dispensers_total;
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
      .sortBy('id')
      .value();
  },

  prepareMapData: function () {
    // Add the values to the geo array.
    let d = this.props.data;
    return d.geo.map(o => {
      let countryData = _.find(d.data, {iso: o.iso});
      o.values = countryData.values;
      return o;
    });
  },

  renderColSlider: function () {
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

    return (
      <div className='col--full'>
        <h2 className='section__title'>{this.props.data.content.title}</h2>
        <div className='section-description' dangerouslySetInnerHTML={{__html: this.props.data.content.content}} />
        <p className='chart-title'>People Served with Access to Dispensers</p>
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
        return sum + currentObj.dispensers_total;
      }, 0);
    }

    return (
      <div className='col--sec'>
      <p className='people-served-total'>{totalDispensers ? d3.format(',d')(totalDispensers) : 'Loading...'} <span className='info-description'>dispensers installed</span></p>
        <SectionMap
          activeDate={this.props.fetched ? this.getCurrentDate() : null}
          data={mapData} />
      </div>
    );
  },

  renderChartKey: function () {
    let c = this.props.country;
    return (
      <ul className='access-key'>
        {this.countryMatrix.map(o => {
          let countryLow = o.v.toLowerCase();
          return c === 'overview' || c === countryLow ? <li key={o.k} className={`country-${countryLow}`}>{o.v}</li> : null;
        })}
      </ul>
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
    let totalPeople = _.reduce(series, (sum, o) => {
      let currentObj = _.find(o.values, d => d.timestep.toISOString() === this.getCurrentDate().toISOString());
      return sum + currentObj.people_total;
    }, 0);

    return (
      <div className='col--main'>
        <p className='people-served-total'>{d3.format(',d')(totalPeople)} <span className='info-description'>people served</span></p>
        <div className='infographic'>
            <div className='key'>
              {this.renderChartKey()}
            </div>
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

        <div className='inner'>
          {this.renderColSlider()}
        </div>

      </section>
    );
  }
});

module.exports = SectionAccess;
