const _ = require('lodash');
const tokenizer = require('acorn');

/**
 * Return an array of all strings from javascript file.
 **/
module.exports = (code, config) => {
  const tokens = [];

  tokenizer.parse(code, _.defaults({ onToken: tokens }, config));

  return _.uniq(
    // Return only unique values of 'string' type objects.
    tokens.filter(t => t.type.label === 'string').map(t => t.value)
  );
};
