/**
 * Calculate Shannon's entropy for a string
 */
module.exports = (str) => {
  const set = {};

  str.split('').forEach(
    /* eslint no-return-assign: "off" */
    c => (set[c] ? set[c]++ : (set[c] = 1))
  );

  return Object.keys(set).reduce((acc, c) => {
    const p = set[c] / str.length;
    return acc - (p * (Math.log(p) / Math.log(2)));
  }, 0);
};
