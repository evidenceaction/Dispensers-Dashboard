'use strict';
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import Popover from '../../utils/popover';

var LineChart = React.createClass({
  displayName: 'LineChart',

  propTypes: {
    className: React.PropTypes.string
  },

  chart: null,

  onWindowResize: function () {
    this.chart.update();
  },

  componentDidMount: function () {
    // console.log('LineChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new Chart(this.refs.container, this.props);
  },

  componentWillUnmount: function () {
    // console.log('LineChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function (/* prevProps, prevState */) {
    // console.log('LineChart componentDidUpdate');
    this.chart.setData(this.props);
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = LineChart;

var Chart = function (el, data) {
  this.$el = d3.select(el);

  this.data = null;

  var _this = this;

  // Var declaration.
  var margin = {top: 24, right: 10, bottom: 28, left: 42};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Draw functions.
  var line;
  // Scales, Axis.
  var x, y, xAxis, yAxis;
  // Elements.
  var svg, dataCanvas;
  // Init the popover.
  var chartPopover = new Popover();

  this._calcSize = function () {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt(this.$el.style('height'), 10) - margin.top - margin.bottom;
  };

  this.setData = function (data) {
    var _data = _.cloneDeep(data);
    this.popoverContentFn = _data.popoverContentFn;
    this.topThreshold = _data.topThreshold || null;
    this.bottomThreshold = _data.bottomThreshold || null;
    this.data = _data.data;
    this.update();
  };

  this._init = function () {
    this._calcSize();
    // The svg.
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    // X scale. Range updated in function.
    x = d3.time.scale();

    // Y scale. Range updated in function.
    y = d3.scale.linear();

    // Line function for the delimit the area.
    line = d3.svg.line()
      .x(d => x(d.timestep))
      .y(d => y(d.tcr_avg));

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(d3.time.format('%b %y'));

    yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(0)
      .tickPadding(10)
      .orient('left')
      .tickFormat(tick => tick === 0 || tick === 100 ? `${tick}%` : '');

    // Chart elements
    dataCanvas = svg.append('g')
      .attr('class', 'data-canvas')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('g')
      .attr('class', 'x axis')
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'start');

    svg.append('g')
      .attr('class', 'y axis')
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle');

    //   // Group to hold the areas.
    // dataCanvas.append('g')
    //   .attr('class', 'area-group');

    // // Group to hold the area delimiter lines.
    // dataCanvas.append('g')
    //   .attr('class', 'area-line-group');

    // // Group to hold the area delimiter line points.
    // dataCanvas.append('g')
    //   .attr('class', 'area-line-points-group');

    // //////////////////////////////////////////////////
    // Focus elements.
    // Focus line and circles show on hover.

    // Group to hold the focus elements.
    var focus = svg.append('g')
      .style('pointer-events', 'none')
      .attr('class', 'focus-elements')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .style('display', 'none');

    // Vertical focus line.
    focus.append('line')
     .attr('class', 'focus-line');

    // Groups to hold the focus circles.
    focus.append('g')
      .attr('class', 'focus-circles');

    // Add focus rectangle. Will be responsible to trigger the events.
    svg.append('rect')
      .attr('class', 'trigger-rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .on('mouseover', this._onMouseOver)
      .on('mouseout', this._onMouseOut)
      .on('mousemove', this._onMouseMove);
  };

  this.update = function () {
    if (this.data === null) {
      return;
    }
    this._calcSize();

    // Update scale ranges
    let sDate = _.first(this.data.values).timestep;
    let eDate = _.last(this.data.values).timestep;
    x
      .domain([sDate, eDate])
      .range([0, _width]);

    // Since the data is stacked the last element will contain the
    // highest values)
    y
      .domain([0, 100])
      .range([_height, 0]);

    // xAxis.ticks(this.data[0].values.length);
    xAxis.ticks(5);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    // Set the data to use to get the correct index.
    svg.select('.trigger-rect')
      .datum(this.data)
      .attr('width', _width)
      .attr('height', _height);

    // ------------------------------
    // lines.
    let the_line = dataCanvas.selectAll('.data-line')
      .data([this.data]);
    // Handle new.
    the_line.enter()
      .append('path');

    // Update current.
    the_line
        .attr('d', d => line(d.values))
        .attr('class', d => `data-line`);

    // Remove old.
    the_line.exit()
      .remove();

    // ------------------------------
    // Threshold.

    let thresholdsData = [];
    if (this.topThreshold) {
      thresholdsData.push({
        key: 'top',
        value: this.topThreshold,
        x: 0,
        y: 0,
        width: _width,
        height: y(this.topThreshold)
      });
    }

    if (this.bottomThreshold) {
      thresholdsData.push({
        key: 'bottom',
        value: this.bottomThreshold,
        x: 0,
        y: y(this.bottomThreshold),
        width: _width,
        height: _height - y(this.bottomThreshold)
      });
    }

    let thresholds = dataCanvas.selectAll('g.threshold')
      .data(thresholdsData);

    // Enter.
    let enterThresholds = thresholds.enter().append('g')
      .attr('class', d => `${d.key} threshold`);

    enterThresholds.append('rect')
      .datum(d => d)
      .attr('class', 'highlight-area');
    enterThresholds.append('line')
      .datum(d => d)
      .attr('class', 'limit-line');
    enterThresholds.append('text')
      .datum(d => d)
      .attr('class', 'value')
      .attr('text-anchor', 'end')
      .attr('dy', '0.25em');

    // Update.
    thresholds.select('.highlight-area')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height);

    thresholds.select('.limit-line')
      .attr('x1', d => d.x)
      .attr('y1', d => y(d.value))
      .attr('x2', d => d.width)
      .attr('y2', d => y(d.value));

    thresholds.select('.value')
      .attr('x', -5)
      .attr('y', d => y(d.value))
      .text(d => `${d.value}%`);

    // Remove.
    thresholds.exit()
      .remove();

    // ------------------------------
    // Append Axis.
    svg.select('.x.axis')
      .attr('transform', `translate(${margin.left},${_height + margin.top})`)
      // .transition()
      .call(xAxis);

    // svg.select('.x.axis .label')
    //   .text('date');

    svg.select('.y.axis')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      // .transition()
      .call(yAxis);

    // svg.select('.y.axis .label')
    //   .text('a value');

    // ------------------------------
    // Focus line used for highlight.
    svg.select('.focus-elements')
      .style('display', 'none');

    let focusCirc = svg.select('.focus-circles')
      .selectAll('circle.circle')
      .data([this.data]);

    focusCirc.enter()
      .append('circle')
        .attr('r', 4)
        .attr('class', 'circle');

    focusCirc.exit()
      .remove();
  };

  this.destroy = function () {
    chartPopover.hide();
  };

  this._positionFocusElements = function (timestep) {
    svg.select('.focus-line')
      .transition()
      .duration(50)
      .attr('x1', x(timestep))
      .attr('y1', _height)
      .attr('x2', x(timestep))
      .attr('y2', 0);

    svg.select('.focus-circles')
      .selectAll('.circle')
      .transition()
      .duration(50)
      .attr('cx', x(timestep))
      .attr('cy', d => {
        let val = _.find(d.values, o => o.timestep.format('YYYY-MM-DD') === timestep.format('YYYY-MM-DD'));
        return y(val.tcr_avg);
      });
  };

  this._onMouseOver = function () {
    svg.select('.focus-elements').style('display', null);
  };

  this._onMouseOut = function () {
    svg.select('.focus-elements').style('display', 'none');
    chartPopover.hide();
  };

  this._onMouseMove = function (data) {
    let datum = data.values;
    // Define bisector function. Is used to find the closest year
    // to the mouse position.
    let bisect = d3.bisector(d => d.timestep).left;
    let mouseDate = x.invert(d3.mouse(this)[0]);

    // Returns the index to the current data item.
    let i = bisect(datum, mouseDate);

    let doc;
    if (i === 0) {
      doc = datum[i];
    } else {
      let d0 = datum[i - 1];
      let d1 = datum[i];
      // Work out which date value is closest to the mouse
      if (mouseDate - d0.timestep > d1.timestep - mouseDate) {
        doc = d1;
      } else {
        doc = d0;
        i = i - 1;
      }
    }

    _this._positionFocusElements(doc.timestep);

    if (_this.popoverContentFn) {
      let matrix = dataCanvas.node().getScreenCTM()
        .translate(x(doc.timestep), y(doc.fcr_avg));

      var posX = window.pageXOffset + matrix.e;
      var posY = window.pageYOffset + matrix.f - 16;

      chartPopover.setContent(_this.popoverContentFn(data, i)).show(posX, posY);
    }
  };

  // ------------------------------------------------------------------------ //
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};
