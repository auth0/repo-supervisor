'use strict';

const dictionary = new Set(require('an-array-of-english-words'));
const config = require('./../../../../config/filters/entropy.meter.json');

function splitIntoWords(str) {
  // Hyphens, underscores, commas, stops and numbers
  str = str.replace(/[-_,.|]/g, ' ')
    .replace(/([0-9]+)/g, ' $1 ');

  // camelCase
  str = str.replace(/([A-Z]+?)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  // Split into parts
  return str.trim().split(/ +/);
}

/**
 * Determine if a string is composed of dictionary words in camelCase or similar formats
 * eg: MY_VARIABLE, myVariable, MyHTMLGenerator, an-identifier-string
 *
 * This reduces the number of variables, classes, and such that appear
 *
 * @param str {string} The input string
 * @returns {boolean} True if it is not composed of words, false if it is
 */
module.exports = function filterCamelCaseWord(str) {
  const words = splitIntoWords(str);

  // Compare against the word list
  const wordCount = words.reduce(
    (acc, word) => acc + (word.length > 2 && dictionary.has(word)),
    0
  );

  const percent = wordCount / words.length;
  return percent < config.options.preFilters.dictionaryWords.requiredDictionaryWordsPercent;
};
