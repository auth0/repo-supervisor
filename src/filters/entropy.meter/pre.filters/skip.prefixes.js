/* eslint no-return-assign: "off" */

/**
 * Skip strings with predefined prefixes.
 */
module.exports = (s, config) => !!config.skipPrefixes.reduce((acc, prefix) =>
  (acc &= !(s.indexOf(prefix) === 0)), 1);
