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

  var _this = this;

  // Var declaration.
  var margin = {top: 24, right: 10, bottom: 28, left: 42};
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
    this.mouseoverFn = _data.mouseover || _.noop;
    this.mouseoutFn = _data.mouseout || _.noop;
    this.xHighlight = _data.xHighlight || null;
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
      .x(d => d.timestep)
      // Where to get the y value. This will be used by the
      // area function as y0 (which is used to stack.)
      .y(d => d.people_total);

    // Area definition function.
    area = d3.svg.area()
      .x(d => x(d.timestep))
      // The y0 and y1 define the upper and lower positions for the
      // area. This will be used to stack the areas.
      .y0(d => y(d.y0))
      .y1(d => y(d.y0 + d.y));

    // Line function for the delimit the area.
    line = d3.svg.line()
      .x(d => x(d.timestep))
      .y(d => y(d.y0 + d.y));

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(0)
      .tickFormat(d3.time.format('%b %y'));

    yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(0)
      .orient('left')
      .tickFormat(d => `${(d / 1e6)}M`);

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

    // Group to hold the focus elements.
    var focus = dataCanvas.append('g')
      .attr('class', 'focus-elements')
      .style('display', 'none');

    // Vertical focus line.
    focus.append('line')
     .attr('class', 'focus-line');

    // Groups to hold the focus circles.
    focus.append('g')
      .attr('class', 'focus-circles');

    // Add focus rectangle. Will be responsible to trigger the events.
    dataCanvas.append('rect')
      .attr('class', 'trigger-rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
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
    let sDate = _.first(this.data[0].values).timestep;
    let eDate = _.last(this.data[0].values).timestep;
    x
      .domain([sDate, eDate])
      .range([0, _width]);

    // Since the data is stacked the last element will contain the
    // highest values)
    let yMax = d3.max(_.last(this.data).values.map(d => d.y0 + d.y));
    y
      .domain([0, yMax + yMax * 0.1])
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
    dataCanvas.select('.trigger-rect')
      .datum(this.data)
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

    // ------------------------------
    // Focus line used for highlight.
    dataCanvas.select('.focus-elements')
      .style('display', null);

    // dataCanvas.select('.focus-line')
    //   .transition()
    //   .duration(100)
    //   .attr('x1', x(this.xHighlight))
    //   .attr('y1', _height)
    //   .attr('x2', x(this.xHighlight))
    //   .attr('y2', 0);

    let focusCirc = dataCanvas.select('.focus-circles')
      .selectAll('circle.circle')
      .data(this.data);

    focusCirc.enter()
      .append('circle')
        .attr('r', 4)
        .attr('class', 'circle');

    // focusCirc
    //   .transition()
    //   .duration(100)
    //   .attr('cx', x(this.xHighlight))
    //   .attr('cy', d => {
    //     let val = _.find(d.values, o => o.timestep.format('YYYY-MM-DD') === this.xHighlight.format('YYYY-MM-DD'));
    //     return y(val.y0 + val.y);
    //   });

    this._positionFocusElements(this.xHighlight);

    focusCirc.exit()
      .remove();

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

  this._positionFocusElements = function (timestep) {
    dataCanvas.select('.focus-line')
      .transition()
      .duration(50)
      .attr('x1', x(timestep))
      .attr('y1', _height)
      .attr('x2', x(timestep))
      .attr('y2', 0);

    dataCanvas.select('.focus-circles')
      .selectAll('.circle')
      .transition()
      .duration(50)
      .attr('cx', x(timestep))
      .attr('cy', d => {
        let val = _.find(d.values, o => o.timestep.format('YYYY-MM-DD') === timestep.format('YYYY-MM-DD'));
        return y(val.y0 + val.y);
      });
  };

  this._onMouseOver = function () {
    _this._positionFocusElements(_this.xHighlight);
    // dataCanvas.select('.focus-elements').style('display', null);
    _this.mouseoverFn();
  };

  this._onMouseOut = function () {
    _this._positionFocusElements(_this.xHighlight);
    // dataCanvas.select('.focus-elements').style('display', 'none');
    _this.mouseoutFn();
    chartPopover.hide();
  };

  this._onMouseMove = function (data) {
    let datum = _.last(data).values;
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
        .translate(x(doc.timestep), y(doc.y0 + doc.y));

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
