const chai = require('chai');

global.expect = require('chai').expect;
global.srcPath = process.cwd() + '/src/';
global.defaultFixtures = require('./fixtures/fixtures.json');
global.configs = {
  preFilters: require('./../config/filters/entropy.meter.json').options.preFilters
};

global.getFixtures = (filepath) =>
  require(filepath.replace(/\/test\/(unit|integration)\//, '/test/fixtures/$1/').replace(/\.js$/, '.json'));

require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});
