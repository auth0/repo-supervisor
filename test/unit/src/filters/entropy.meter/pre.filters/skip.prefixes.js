const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/skip.prefixes.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Skip prefixes', () => {
  it('should skip all words with defined prefixes at the beginning', () => {
    const config = { skipPrefixes: fixtures.prefixes };
    fixtures.shouldMatchPrefixes.forEach((word) => {
      expect(filter(word, config), word).to.be.equal(false);
    });
  });

  it('should allow all words without defined prefixes at the beginning', () => {
    const config = { skipPrefixes: fixtures.prefixes };
    fixtures.withoutPrefixes.forEach((word) => {
      expect(filter(word, config), word).to.be.equal(true);
    });
  });

  it('should allow all words with prefixes at the end', () => {
    const config = { skipPrefixes: fixtures.prefixes };
    fixtures.shouldNotMatchPrefixes.forEach((word) => {
      expect(filter(word, config), word).to.be.equal(true);
    });
  });

  it('should not detect random secrets as words with prefixes', () => {
    global.defaultFixtures.randomSecrets.forEach((secret) => {
      const config = { skipPrefixes: fixtures.prefixes };
      expect(filter(secret, config), secret).to.be.equal(true);
    });
  });
});
