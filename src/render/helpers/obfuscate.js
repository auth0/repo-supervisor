'use strict';

module.exports = (config) => {
  const numOfFakeChars = 20;
  const numOfChars = config.obfuscate.numOfVisibleCharacters;

  return {
    name: 'obfuscate',
    cb: str => str.substring(0, numOfChars) + '*'.repeat(numOfFakeChars)
  };
};
