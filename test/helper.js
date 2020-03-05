const chai = require('chai');

global.expect = chai.expect;
global.assert = chai.assert;
global.srcPath = `${process.cwd()}/src/`;
global.defaultFixtures = require('./fixtures/fixtures.json');

global.configs = {
  preFilters: require('./../config/filters/entropy.meter.json').options.preFilters
};

global.getFixtures = (filepath) => {
  if (filepath.includes('\\test\\')) {
    // Windows uses \, but the regex needs /
    filepath = filepath.replace(/\\/g, '/');
  }

  const jsonPath = filepath.replace(/\/test\/(unit|integration)\//, '/test/fixtures/$1/').replace(/\.js$/, '.json');
  return require(jsonPath);
};

require('@babel/register')({
  ignore: [/node_modules/]
});
