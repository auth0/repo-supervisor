const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/object.keys.identifiers.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Object key identifiers', () => {
  it('should skip all strings that look like object keys', () => {
    fixtures.objectKeys.forEach((keyName) => {
      expect(filter(keyName), keyName).to.be.equal(false);
    });
  });

  it('should allow strings that does not look like object keys', () => {
    fixtures.notObjectKeys.forEach((keyName) => {
      expect(filter(keyName), keyName).to.be.equal(true);
    });
  });

  it('should not detect random secrets as multiple words', () => {
    global.defaultFixtures.randomSecrets.forEach((secret) => {
      expect(filter(secret), secret).to.be.equal(true);
    });
  });
});
