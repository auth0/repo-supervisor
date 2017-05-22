const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/email.addresses.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> E-mail addresses', () => {
  it('should detect all valid e-mail addresses', () => {
    fixtures.validEmailAddresses.forEach((email) => {
      expect(filter(email), email).to.be.equal(false);
    });
  });

  it('should not detect random secrets as e-mail addresses', () => {
    defaultFixtures.randomSecrets.forEach((secret) => {
      expect(filter(secret), secret).to.be.equal(true);
    });
  });
});
