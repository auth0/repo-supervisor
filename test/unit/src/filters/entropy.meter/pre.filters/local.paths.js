const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/local.paths.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Local paths', () => {
  it('should detect all valid local paths', () => {
    fixtures.validLocalPaths.forEach((path) => {
      expect(filter(path), path).to.be.equal(false);
    });
  });

  it('should not detect random secrets as local paths', () => {
    global.defaultFixtures.randomSecrets.forEach((secret) => {
      expect(filter(secret), secret).to.be.equal(true);
    });
  });
});
