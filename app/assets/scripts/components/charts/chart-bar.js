'use strict';
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import Popover from '../../utils/popover';

var ChartBar = React.createClass({
  displayName: 'ChartBar',

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

module.exports = ChartBar;

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
      .tickFormat((date) => date.format('YY-MM'));

    yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickSize(0);

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
    let yMax = d3.max(this.data.values, o => o.functional.total_rate);

    y
      .domain([0, yMax])
      .range([_height, 0]);

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
        return `translate(${x(d.timestep)},0)`;
      });

    let barsOutages = barGroups.selectAll('rect.bar-outages')
      .data(d => [d]);

    barsOutages.enter()
      .append('rect')
      .attr('class', 'bar-outages');

    barsOutages
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', x.rangeBand())
      .attr('height', _height);

    barsOutages.exit()
      .remove();

    let barsFunctional = barGroups.selectAll('rect.bar-installed')
      .data(d => [d]);

    barsFunctional.enter()
      .append('rect')
      .attr('class', 'bar-installed');

    barsFunctional
      .attr('x', 0)
      .attr('y', d => y(d.functional.total_rate))
      .attr('width', x.rangeBand())
      .attr('height', d => _height - y(d.functional.total_rate));

    barsFunctional.exit()
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
      .style('fill', 'none')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', x.rangeBand())
      .attr('height', _height);

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

    svg.select('.y.axis')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      // .transition()
      .call(yAxis);

    svg.select('.y.axis .label')
      .text('')

  };

  this.destroy = function () {
    chartPopover.hide();
  };

  this._onMouseOver = function (d) {
    if (_this.popoverContentFn) {
      let matrix = this.getScreenCTM()
        .translate(this.getAttribute('x') + x.rangeBand() / 2, this.getAttribute('y'));

      var posX = window.pageXOffset + matrix.e;
      var posY = window.pageYOffset + matrix.f + 250;

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
