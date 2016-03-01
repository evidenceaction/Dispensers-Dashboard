'use strict';
import React from 'react';
import Rcslider from 'rc-slider';
import moment from 'moment';
import _ from 'lodash';
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
      currentSliderPos: 0
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
          // console.log('timestep before', d.timestep);
          // d.timestep = new Date(d.timestep);
          d.timestep = moment.utc(d.timestep);
          // console.log('timestep after', d.timestep.toISOString());
          // console.log('----');
        });
        return res;
      })
      .value();
  }),

  renderLoading: function () {
    return (
      <div className='col--main'>
        <p>Data is loading!</p>
      </div>
    );
  },

  renderContent: function () {
    let series = this.prepareChartData();

    return (
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
            xHighlight={this.getCurrentDate()}
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
            0: this.getStartDate().format('YYYY-MM-DD'),
            [this.computeSliderMax()]: this.getEndDate().format('YYYY-MM-DD')
          }} />

      </div>
    );
  },

  render: function () {
    let g = [];
    if (this.props.fetched) {
      console.log('this.props.data', this.props.data);
      let d = this.props.data;
      g = d.geo.map(o => {
        let countryData = _.find(this.props.data.data, {iso: o.iso});
        // o.value = _.find(countryData.values, o => moment.utc(o.timestep).format('YYYY-MM-DD') === curr);
        o.values = countryData.values;
        return o;
      });
    }

    return (
      <section className='page__content section--access'>
        <div className='inner'>
          {this.props.fetched ? (
            this.props.fetching ? this.renderLoading() : this.renderContent()
          ) : null}

          <div className='col--sec'>
            <SectionMap
              activeDate={this.props.fetched ? this.getCurrentDate() : null}
              data={g} />
          </div>
        </div>
      </section>
    );
  }
});

module.exports = SectionAccess;
