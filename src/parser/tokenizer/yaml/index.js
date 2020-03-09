const yaml = require('js-yaml');
const { flatten, uniq } = require('lodash');

// Set recursion limit
const maxDepth = 50;

const toArray = (obj, arr, depth = 0) => {
  if (obj && depth < maxDepth) {
    depth++;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value !== null && typeof value === 'object') {
        toArray(value, arr, depth);
      } else if (value) {
        arr.push(value.toString());
      }
    });
  } else if (depth >= maxDepth) {
    throw new Error(`Maximum object depth (${maxDepth}) exceeded.`);
  }
  return arr;
};

module.exports = (content) => {
  const result = [];
  let object;

  try {
    object = yaml.safeLoad(content);
  } catch (e) {
    return [];
  }

  toArray(object, result);

  return uniq(flatten(result));
};
