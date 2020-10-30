const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/regex.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Regular expressions', () => {
  it('should ignore all defined regular expressions', () => {
    fixtures.commonRegexPattern.forEach((pattern) => {
      expect(filter(pattern), pattern).to.be.equal(false);
    });
  });

  it('should not ignore all non-standard patterns in regular expressions', () => {
    fixtures.nonStandardRegexPattern.forEach((pattern) => {
      expect(filter(pattern), pattern).to.be.equal(true);
    });
  });
});
