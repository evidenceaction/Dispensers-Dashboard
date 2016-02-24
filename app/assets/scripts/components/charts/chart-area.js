'use strict';
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import Popover from '../../utils/popover';

var AreaChart = React.createClass({
  displayName: 'AreaChart',

  propTypes: {
    className: React.PropTypes.string
  },

  chart: null,

  onWindowResize: function () {
    this.chart.update();
  },

  componentDidMount: function () {
    // console.log('AreaChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new Chart(this.refs.container, this.props);
  },

  componentWillUnmount: function () {
    // console.log('AreaChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function (/* prevProps, prevState */) {
    // console.log('AreaChart componentDidUpdate');
    this.chart.setData(this.props);
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = AreaChart;

var Chart = function (el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.stages = null;

  // Var declaration.
  var margin = {top: 64, right: 32, bottom: 48, left: 32};
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
    this.popoverContentFn = _data.popoverContentFn;
    this.data = stack(_data.series);
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

    // Stack fn.
    stack = d3.layout.stack()
      // Define where to get the values from.
      .values(d => d.values)
      .x(d => d.date)
      // Where to get the y value. This will be used by the
      // area function as y0 (which is used to stack.)
      .y(d => d.value);

    // Area definition function.
    area = d3.svg.area()
      .x(d => x(d.date))
      // The y0 and y1 define the upper and lower positions for the
      // area. This will be used to stack the areas.
      .y0(d => y(d.y0))
      .y1(d => y(d.y0 + d.y));

    // Line function for the delimit the area.
    line = d3.svg.line()
      .x(d => x(d.date))
      .y(d => y(d.y0 + d.y));

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(0)
      .tickFormat(d3.time.format('%Y-%m'));

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

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

      // Group to hold the areas.
    dataCanvas.append('g')
      .attr('class', 'area-group');

    // Group to hold the area delimiter lines.
    dataCanvas.append('g')
      .attr('class', 'area-line-group');

    // Group to hold the area delimiter line points.
    dataCanvas.append('g')
      .attr('class', 'area-line-points-group');

    // //////////////////////////////////////////////////
    // Focus elements.
    // Focus line and circles show on hover.

    // Add focus rectangle. Will be responsible to trigger the events.
    dataCanvas.append('rect')
      .attr('class', 'trigger-rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function () { focus.style('display', null); })
      .on('mouseout', function () { focus.style('display', 'none'); })
      .on('mousemove', this.onMouseMove);

    // Group to hold the focus elements.
    var focus = dataCanvas.append('g')
      .attr('class', 'focus-elements')
      .style('display', 'none');

    // Vertical focus line.
    focus.append('line')
     .attr('class', 'focus-line');
  };

  this.update = function () {
    if (this.data === null) {
      return;
    }
    this._calcSize();

    // Update scale ranges
    let sDate = _.first(this.data[0].values).date;
    let eDate = _.last(this.data[0].values).date;
    x
      .domain([sDate, eDate])
      .range([0, _width]);

    // Since the data is stacked the last element will contain the
    // highest values)
    let yMax = d3.max(_.last(this.data).values.map(d => d.y0 + d.y));
    y
      .domain([0, yMax])
      .range([_height, 0]);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    // Set the data to be get the correct index.
    // The x values are common throughout the data so we only need one.
    dataCanvas.select('.trigger-rect')
      .datum(this.data[0])
      .attr('width', _width)
      .attr('height', _height);

    // ------------------------------
    // Areas.
    var areas = dataCanvas.select('.area-group').selectAll('.area')
      .data(this.data);
    // Handle new.
    areas.enter()
      .append('path');

    // Update current.
    areas
      .attr('d', d => area(d.values))
      .attr('class', d => `area`);

    // Remove old.
    areas.exit()
      .remove();

    // ------------------------------
    // Area lines.
    let area_delimiters = dataCanvas.select('.area-line-group').selectAll('.area-line')
      .data(this.data);
    // Handle new.
    area_delimiters.enter()
      .append('path');

    // Update current.
    area_delimiters
        .attr('d', d => line(d.values))
        .attr('class', d => `area-line`);

    // Remove old.
    area_delimiters.exit()
      .remove();

    // ------------------------------
    // Append Axis.
    svg.select('.x.axis')
      .attr('transform', `translate(${margin.left},${_height + margin.top})`)
      // .transition()
      .call(xAxis);

    svg.select('.x.axis .label')
      .text('date');

    svg.select('.y.axis')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      // .transition()
      .call(yAxis);

    svg.select('.y.axis .label')
      .text('a value');

      // .selectAll('.tick text')
      //   .call(wrap, 100);

      // .on('mouseover', function (d) {
      //   var matrix = this.getScreenCTM()
      //     .translate(this.getAttribute('x'), this.getAttribute('y'));

      //   // This is the width of the real bar, not the ghost one.
      //   var barWidth = x(_.sum(d.data, 'value'));

      //   var posX = window.pageXOffset + matrix.e + barWidth / 2;
      //   var posY = window.pageYOffset + matrix.f - 8;

      //   chartPopover.setContent(_this.popoverContentFn(d)).show(posX, posY);
      // })
      // .on('mouseout', function (d) {
      //   chartPopover.hide();
      // });
  };

  this.destroy = function () {
    chartPopover.hide();
  };

  this.onMouseMove = function (datum) {
    let data = datum.values;
    // Define bisector function. Is used to find the closest year
    // to the mouse position.
    let bisect = d3.bisector(d => d.date).left;
    let mouseDate = x.invert(d3.mouse(this)[0]);

    // Returns the index to the current data item.
    let i = bisect(data, mouseDate);

    let d0 = data[i - 1];
    let d1 = data[i];
    // work out which date value is closest to the mouse
    let d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;

    console.log('x(d.date)', x(d.date));

    dataCanvas.select('.focus-line')
      .attr('x1', x(d.date))
      .attr('y1', _height)
      .attr('x2', x(d.date))
      .attr('y2', 0);
  };

  // ------------------------------------------------------------------------ //
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};
