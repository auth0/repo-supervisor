/* eslint no-return-assign: "off" */

/**
 * Skip strings with predefined prefixes.
 */
module.exports = (s, config) => !config.skipPrefixes.some(prefix => s.startsWith(prefix));
