const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/multiple.words.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Multiple words', () => {
  it('should skip all strings with multiple words', () => {
    fixtures.multipleWords.forEach((words) => {
      expect(filter(words), words).to.be.equal(false);
    });
  });

  it('should allow all strings with single words', () => {
    fixtures.singleWords.forEach((words) => {
      expect(filter(words), words).to.be.equal(true);
    });
  });

  it('should not detect random secrets as multiple words', () => {
    global.defaultFixtures.randomSecrets.forEach((secret) => {
      expect(filter(secret), secret).to.be.equal(true);
    });
  });
});
