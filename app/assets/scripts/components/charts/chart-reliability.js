'use strict';
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import Popover from '../../utils/popover';
import { formatThousands } from '../../utils/numbers';

var ReliabilityChart = React.createClass({
  displayName: 'ReliabilityChart',

  propTypes: {
    className: React.PropTypes.string
  },

  chart: null,

  onWindowResize: function () {
    this.chart.update();
  },

  componentDidMount: function () {
    // console.log('ReliabilityChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new Chart(this.refs.container, this.props);
  },

  componentWillUnmount: function () {
    // console.log('ReliabilityChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function (/* prevProps, prevState */) {
    // console.log('ReliabilityChart componentDidUpdate');
    this.chart.setData(this.props);
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = ReliabilityChart;

var Chart = function (el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.stages = null;

  var _this = this;

  // Var declaration.
  var margin = {top: 32, right: 32, bottom: 48, left: 48};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales, Axis.
  var x, y, xAxis;
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
    this.data = _data.data;
    this.update();
  };

  this._init = function () {
    this._calcSize();
    // The svg.
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    // X scale. Range updated in function.
    x = d3.scale.ordinal();

    // Y scale. Range updated in function.
    y = d3.scale.linear();

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(0)
      .tickPadding(10)
      .tickFormat((date) => date.format('MMM YY'));

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

    let gridElements = dataCanvas.append('g')
      .attr('class', 'grid-elements');

    gridElements.append('line')
      .attr('class', 'mid-line');

    gridElements.append('line')
      .attr('class', 'avg-line-chlorine');

    gridElements.append('text')
      .attr('class', 'avg-label-chlorine')
      .attr('text-anchor', 'end')
      .attr('dy', '0.25em');
    gridElements.append('text')
      .attr('class', 'avg-label-chlorine avg')
      .attr('text-anchor', 'end')
      .attr('dy', '1.25em');

    gridElements.append('line')
      .attr('class', 'avg-line-hardware');

    gridElements.append('text')
      .attr('class', 'avg-label-hardware')
      .attr('text-anchor', 'end')
      .attr('dy', '0.25em');
    gridElements.append('text')
      .attr('class', 'avg-label-hardware avg')
      .attr('text-anchor', 'end')
      .attr('dy', '1.25em');
  };

  this.update = function () {
    if (this.data === null) {
      return;
    }
    this._calcSize();

    x
      // .domain(_.map(this.data.values, o => o.timestep.format('YYYY-MM-DD')))
      .domain(_.map(this.data.values, 'timestep'))
      .rangeBands([0, _width], 1 / 4, 1 / 8);

    xAxis.ticks(this.data.values.length);

    // Computing max y taking all bars into account.
    let m1 = d3.max(this.data.values, o => o.outages.chlorine_rate);
    let m2 = d3.max(this.data.values, o => o.outages.hardware_rate);
    let yMax = Math.ceil(Math.max(m1, m2));

    y
      .domain([0, yMax])
      .range([_height / 2, 0]);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    // Set the data to use to get the correct index.
    dataCanvas.select('.trigger-rect')
      .datum(this.data)
      .attr('width', _width)
      .attr('height', _height);

    // ------------------------------
    // Bars Axis.
    let barGroups = dataCanvas.selectAll('g.bar-group')
      .data(this.data.values);

    barGroups.enter()
      .append('g')
      .attr('class', 'bar-group');

    barGroups
      .attr('transform', d => {
        return `translate(${x(d.timestep)},0)`;
      });

    let barsChlorine = barGroups.selectAll('rect.bar-chlorine')
      .data(d => [d]);

    barsChlorine.enter()
      .append('rect')
      .attr('class', 'bar-chlorine');

    barsChlorine
      .attr('x', 0)
      .attr('y', d => y(d.outages.chlorine_rate))
      .attr('width', x.rangeBand())
      .attr('height', d => _height / 2 - y(d.outages.chlorine_rate));

    barsChlorine.exit()
      .remove();

    let barsHardware = barGroups.selectAll('rect.bar-hardware')
      .data(d => [d]);

    barsHardware.enter()
      .append('rect')
      .attr('class', 'bar-hardware');

    barsHardware
      .attr('x', 0)
      .attr('y', y(0))
      .attr('width', x.rangeBand())
      .attr('height', d => _height / 2 - y(d.outages.hardware_rate));

    barsHardware.exit()
      .remove();

    let barGhost = barGroups.selectAll('rect.bar-ghost')
      .data(d => [d]);

    barGhost.enter()
      .append('rect')
      .attr('class', 'bar-ghost')
      .style('pointer-events', 'all')
      .on('mouseover', this._onMouseOver)
      .on('mouseout', this._onMouseOut);

    barGhost
      .attr('x', 0)
      .attr('y', d => y(d.outages.chlorine_rate))
      .attr('width', x.rangeBand())
      .attr('height', d => _height - y(d.outages.chlorine_rate) - y(d.outages.hardware_rate));

    barGhost.exit()
      .remove();

    // ------------------------------
    // Append Axis.
    svg.select('.x.axis')
      .attr('transform', `translate(${margin.left},${_height + margin.top})`)
      // .transition()
      .call(xAxis);

    svg.select('.x.axis .label')
      .text('');

    // Y axis is created manually.
    let yAxisG = svg.select('.y.axis');

    if (yAxisG.select('.tick-top').empty()) {
      yAxisG.append('text')
        .attr('class', 'tick-top');
      yAxisG.append('text')
        .attr('class', 'tick-bottom');
      yAxisG.append('text')
        .attr('class', 'tick-middle');
      yAxisG.append('line')
        .attr('class', 'axis-line');
    }

    yAxisG
      .attr('transform', `translate(${margin.left},${margin.top})`);

    yAxisG.select('.tick-top')
      .text(Math.round(yMax) + '%')
      .attr('x', -8)
      .attr('y', 0)
      .attr('dy', '1em')
      .attr('text-anchor', 'end');

    yAxisG.select('.tick-middle')
      .text(0)
      .attr('x', -8)
      .attr('y', _height / 2)
      .attr('dy', '0.25em')
      .attr('text-anchor', 'end');

    yAxisG.select('.tick-bottom')
      .text(Math.round(yMax) + '%')
      .attr('x', -8)
      .attr('y', _height)
      .attr('dy', '-0.5em')
      .attr('text-anchor', 'end');

    yAxisG.select('.axis-line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', _height);

    // ------------------------------
    // Grid Elements
    let gridElements = dataCanvas.select('.grid-elements');

    gridElements.select('.mid-line')
      .attr('x1', 0)
      // The 0.5 ensures pixel perfect because the y indicates the center
      // of the line, like stroke align center.
      .attr('y1', Math.floor(_height / 2) + 0.5)
      .attr('x2', _width)
      .attr('y2', Math.floor(_height / 2) + 0.5);

    let avgHardware = d3.mean(this.data.values, d => d.outages.hardware_rate);
    gridElements.select('.avg-line-hardware')
      .attr('x1', 0)
      .attr('y1', y(0) + _height / 2 - y(avgHardware))
      .attr('x2', _width)
      .attr('y2', y(0) + _height / 2 - y(avgHardware));

    gridElements.select('.avg-label-hardware')
      .attr('x', -5)
      .attr('y', y(0) + _height / 2 - y(avgHardware))
      .text(`${formatThousands(avgHardware, 1)}%`);
    gridElements.select('.avg-label-hardware.avg')
      .attr('x', -5)
      .attr('y', y(0) + _height / 2 - y(avgHardware))
      .text('avg');

    let avgChlorine = d3.mean(this.data.values, d => d.outages.chlorine_rate);
    gridElements.select('.avg-line-chlorine')
      .attr('x1', 0)
      .attr('y1', y(0) - _height / 2 + y(avgChlorine))
      .attr('x2', _width)
      .attr('y2', y(0) - _height / 2 + y(avgChlorine));

    gridElements.select('.avg-label-chlorine')
      .attr('x', -5)
      .attr('y', y(0) - _height / 2 + y(avgChlorine))
      .text(`${formatThousands(avgChlorine, 1)}%`);
    gridElements.select('.avg-label-chlorine.avg')
      .attr('x', -5)
      .attr('y', y(0) - _height / 2 + y(avgChlorine))
      .text('avg');

    // Compute the date lines.
    // We need to have two lines. Figure out the optimal space between them.
    let lineStep = Math.floor(this.data.values.length / 2);
    // To ensure they're centered compute the offset.
    let lineOffset = Math.floor(lineStep / 2);
    let lineData = [];
    // Get the values for which to add a line.
    let index = lineOffset;
    let d;
    while (true) {
      d = this.data.values[index];
      if (!d) {
        break;
      }
      index += lineStep;
      lineData.push(d.timestep);
    }

    let dateLines = gridElements.selectAll('.date-line')
      .data(lineData);

    dateLines.enter()
      .append('line')
        .attr('class', 'date-line');

    dateLines
      .attr('x1', d => x(d) + x.rangeBand() / 2)
      .attr('y1', 0)
      .attr('x2', d => x(d) + x.rangeBand() / 2)
      .attr('y2', _height);

    dateLines.exit()
      .remove();
  };

  this.destroy = function () {
    chartPopover.hide();
  };

  this._onMouseOver = function (d) {
    if (_this.popoverContentFn) {
      let matrix = this.getScreenCTM()
        .translate(this.getAttribute('x') + x.rangeBand() / 2, this.getAttribute('y'));

      var posX = window.pageXOffset + matrix.e;
      var posY = window.pageYOffset + matrix.f;

      chartPopover.setContent(_this.popoverContentFn(d)).show(posX, posY);
    }
  };

  this._onMouseOut = function () {
    chartPopover.hide();
  };

  // ------------------------------------------------------------------------ //
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};
