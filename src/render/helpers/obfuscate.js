module.exports = (config) => {
  const numOfChars = config.obfuscate.numOfVisibleCharacters;

  return {
    name: 'obfuscate',
    cb: str => str.substring(0, numOfChars) + '*'.repeat(str.length - numOfChars)
  };
};
