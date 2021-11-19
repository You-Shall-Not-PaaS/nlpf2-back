const _ = require('lodash')

function deviation(array) {
  var avg = _.sum(array) / array.length;
  return Math.sqrt(_.sum(_.map(array, (i) => Math.pow((i - avg), 2))) / array.length);
};

function median(array) {
  array.sort((a, b) => b - a);
  const length = array.length;
  if (length % 2 == 0) {
    return (array[length / 2] + array[(length / 2) - 1]) / 2;
  } else {
    return array[Math.floor(length / 2)];
  }
}

module.exports = {
  deviation: deviation,
  median: median
}