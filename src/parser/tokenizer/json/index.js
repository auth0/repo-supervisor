const { uniq } = require('lodash');

// eslint-disable-next-line max-len
const flattenDeepObjectIntoArray = (obj, result, getKeys, getValues, maxAllowedDepth, depth = 0) => {
  if (typeof obj !== 'object' || obj === null || depth >= maxAllowedDepth) return [];

  // eslint-disable-next-line consistent-return
  Object.keys(obj).forEach((key) => {
    if (getKeys) result.push(key.toString());

    if (typeof obj[key] === 'object') {
      return flattenDeepObjectIntoArray(obj[key], result, getKeys, getValues, maxAllowedDepth, ++depth);
    }

    if (getValues) result.push((obj[key] || '').toString());
  });

  return result;
};

/**
 * Return an array of all strings from JSON file.
 */
module.exports = (content, config) => {
  let json;

  try {
    json = JSON.parse(content);
  } catch (e) {
    return [];
  }

  return uniq(
    flattenDeepObjectIntoArray(json, [], config.checkObjectKeys, config.checkObjectValues, config.maxAllowedDepth)
  );
};
