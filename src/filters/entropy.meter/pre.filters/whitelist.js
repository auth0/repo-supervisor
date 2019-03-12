/* eslint no-return-assign: "off" */

/**
 * Skip exact strings (case-sensitive).
 */
module.exports = (s, config) => !config.whitelist.includes(s);
