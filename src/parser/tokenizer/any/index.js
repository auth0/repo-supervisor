import { uniq } from 'lodash';

/* Note: this includes / to ensure URLs are split, but this can result in
 * base64-encoded strings * being split.
 *
 * eg: btoa('subjects?_d=1') -> 'c3ViamVjdHM/X2Q9MQ==' -> ['c3ViamVjdHM','X2Q9MQ,'','']
 *
 * This doesn't use \w as that captures -, %, $, and other important characters.
 */
const tokenRegex = /[`#&()=[\]{};:'"/?<>,. \t\r\n]+/;

/**
 * Return an array of all meaningful strings from text file.
 * TODO make sure binary files are not parsed
 */
module.exports = (content) => {
  let result = [];

  try {
    content = content.toString();
    result = content.split(tokenRegex);
  } catch (e) {
    return [];
  }

  return uniq(result);
};
