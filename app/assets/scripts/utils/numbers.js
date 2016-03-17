import d3 from 'd3';

module.exports.formatThousands = function formatThousands (number, decimals = 2) {
  let n = d3.format(',.' + decimals + 'f')(number);
  return n.replace(new RegExp('\\.0{' + decimals + '}$'), '');
};

module.exports.formatCurrency = function formatCurrency (number, decimals = 2) {
  if (number >= 1e9) {
    return d3.format(',.' + decimals + 'f')(number / 1e9) + ' B';
  }
  if (number >= 1e6) {
    return d3.format(',.' + decimals + 'f')(number / 1e6) + ' M';
  }
  return d3.format(',.' + decimals + 'f')(number);
};
