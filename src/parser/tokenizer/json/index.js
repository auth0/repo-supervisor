const { flatten, uniq } = require('lodash');

/**
 * Workaround for not yet released lodash 5.0.
 *
 * Issue: https://github.com/auth0/repo-supervisor/issues/7
 */
const invert = (object) => {
  const toString = Object.prototype.toString;
  const result = {};

  Object.keys(object).forEach((key) => {
    let value = object[key];

    if (value !== null && typeof value.toString !== 'function') {
      value = toString.call(value);
    }

    result[value] = key;
  });

  return result;
};

/**
 * Return an array of all strings from JSON file.
 * TODO parse nested objects.
 */
module.exports = (content, config) => {
  const result = [];
  let json;

  try {
    json = JSON.parse(content);
  } catch (e) {
    return [];
  }

  if (config.checkObjectKeys) result.push(Object.keys(json));
  if (config.checkObjectValues) result.push(Object.keys(invert(json)));

  return uniq(flatten(result));
};
