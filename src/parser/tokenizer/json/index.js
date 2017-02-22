import { invert, flatten, uniq } from 'lodash';

/**
 * Return an array of all strings from JSON file.
 * TODO parse nested objects.
 **/
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
