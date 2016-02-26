'use strict';
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import Popover from '../../utils/popover';

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
  var stack;
  // Draw functions.
  var area, line;
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
    // this.popoverContentFn = _data.popoverContentFn;
    // this.mouseoverFn = _data.mouseover || _.noop;
    // this.mouseoutFn = _data.mouseout || _.noop;
    // this.xHighlight = _data.xHighlight || null;
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
      .tickFormat(d3.time.format('%Y-%m'));

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
      .attr('class', 'avg-line');

      // Group to hold the areas.
    // dataCanvas.append('g')
    //   .attr('class', 'area-group');

    // // Group to hold the area delimiter lines.
    // dataCanvas.append('g')
    //   .attr('class', 'area-line-group');

    // // Group to hold the area delimiter line points.
    // dataCanvas.append('g')
    //   .attr('class', 'area-line-points-group');
  };

  this.update = function () {
    if (this.data === null) {
      return;
    }
    this._calcSize();

    let yMax = _.last(this.data.values).installed;
    yMax += Math.ceil(yMax * 0.1);

    x
      .domain(_.map(this.data.values, 'date'))
      .rangeBands([0, _width], 1 / 4, 1 / 8);

    xAxis.ticks(this.data.values.length);

    console.log('x', x(this.data.values[0].date));
    console.log('x', x(this.data.values[1].date));
    console.log('x', x(this.data.values[2].date));

    // // Since the data is stacked the last element will contain the
    // // highest values)
    // let yMax = d3.max(_.last(this.data).values.map(d => d.y0 + d.y));
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
      .attr('class', 'bar-group')
      .attr('transform', d => {
        return `translate(${x(d.date)},0)`;
      });

    let barsIntalled = barGroups.selectAll('rect.bar-installed')
      .data(d => [d]);

    barsIntalled.enter()
      .append('rect')
      .attr('class', 'bar-installed')
      .style('fill', d => 'green')
      .attr('x', 0)
      .attr('y', d => y(d.installed))
      .attr('width', x.rangeBand())
      .attr('height', d => _height / 2 - y(d.installed));

    // barsIntalled
    //   .transition()
    //   .duration(500)
    //   .attr('y', d => y(d.installed))
    //   .attr('width', d => x(d.value));

    barsIntalled.exit()
      .remove();
    // barsIntalled.exit()
    //   .transition()
    //   .duration(500)
    //   .attr('x', 0)
    //   .attr('width', 0);

    let barsOutages = barGroups.selectAll('rect.bar-outages')
      .data(d => [d]);

    barsOutages.enter()
      .append('rect')
      .attr('class', 'bar-outages')
      .style('fill', d => 'blue')
      .attr('x', 0)
      .attr('y', y(0))
      .attr('width', x.rangeBand())
      .attr('height', d => _height / 2 - y(d.outages));

    barsOutages.exit()
      .remove();

    // ------------------------------
    // Append Axis.
    svg.select('.x.axis')
      .attr('transform', `translate(${margin.left},${_height + margin.top})`)
      // .transition()
      .call(xAxis);

    svg.select('.x.axis .label')
      .text('date');

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
      .text(yMax)
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
      .text(yMax)
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

    let avg = d3.mean(this.data.values, d => d.outages);
    gridElements.select('.avg-line')
      .attr('x1', 0)
      .attr('y1', y(0) + _height / 2 - y(avg))
      .attr('x2', _width)
      .attr('y2', y(0) + _height / 2 - y(avg));

    let lineStep = Math.floor(this.data.values.length / 2);
    let lineOffset = Math.floor(lineStep / 2);
    let lineData = [];

    let index = lineOffset;
    let d;
    while (true) {
      d = this.data.values[index];
      if (!d) {
        break;
      }
      index += lineStep;
      lineData.push(d.date);
    }

    console.log('lineData', lineData);

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

  this._onMouseOver = function () {
    _this.mouseoverFn();
    // if (_this.popoverContentFn) {
    //   let matrix = dataCanvas.node().getScreenCTM()
    //     .translate(x(doc.date), 0);

    //   var posX = window.pageXOffset + matrix.e;
    //   var posY = window.pageYOffset + matrix.f - 16;

    //   chartPopover.setContent(_this.popoverContentFn(data, i)).show(posX, posY);
    // }
  };

  this._onMouseOut = function () {
    _this.mouseoutFn();
    chartPopover.hide();
  };

  // ------------------------------------------------------------------------ //
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};
