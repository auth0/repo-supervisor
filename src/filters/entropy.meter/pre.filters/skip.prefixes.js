/**
 * Skip strings with predefined prefixes.
 **/
module.exports = (s, config) => !!config.options.preFilters.skipPrefixes.reduce((acc, prefix) =>
  (acc &= s.indexOf(prefix) === -1), 1);
