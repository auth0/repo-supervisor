const yaml = require('js-yaml');
const { flatten, uniq } = require('lodash');

const toArray = (obj, arr) => {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value !== null && typeof value === 'object') {
        toArray(value, arr);
      } else if (value) {
        arr.push(value.toString());
      }
    });
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
