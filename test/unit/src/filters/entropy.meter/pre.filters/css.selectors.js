const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/css.selectors.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> CSS selectors', () => {
  it('should detect all valid CSS selectors', () => {
    fixtures.validCSSSelectors.forEach((css) => {
      expect(filter(css), css).to.be.equal(false);
    });
  });

  it('should not detect random secrets as CSS selectors', () => {
    global.defaultFixtures.randomSecrets.forEach((secret) => {
      expect(filter(secret), secret).to.be.equal(true);
    });
  });
});
