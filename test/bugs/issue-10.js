const preFilter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/css.selectors.js`);

/**
 * Issue: https://github.com/auth0/repo-supervisor/issues/10
 **/
describe('Bugs', () => {
  it('[Issue #10] Should detect [name="foobar"]:enabled as a valid CSS selector', () => {
    const cssSelector = '[name="foobar"]:enabled';
    const result = preFilter(cssSelector);

    expect(result).to.be.false;
  });
});