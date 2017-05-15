const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/authentication.urls.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Authentication URLs', () => {
  it('should skip all valid URLs without the authentication params', () => {
    fixtures.urlsWithoutAuthParams.forEach((url) => {
      expect(filter(url), url).to.be.equal(false);
    });
  });

  it('should parse all valid URLs with the authentication params', () => {
    fixtures.urlsWithAuthParams.forEach((url) => {
      expect(filter(url), url).to.equal('john:doe');
    });
  });

  it('should skip URL when there is only an empty string', () => {
    expect(filter(''), '<empty string>').to.be.equal(true);
  });

  it('should skip valid URL where auth params were set to empty values', () => {
    fixtures.urlsWithEmptyAuthParams.forEach((url) => {
      expect(filter(url), url).to.be.equal(false);
    });
  });

  it('should not detect random secrets as URLs or URLs with auth params', () => {
    global.defaultFixtures.randomSecrets.forEach((secret) => {
      expect(filter(secret), secret).to.be.equal(true);
    });
  });
});
