const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/non.printable.characters.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Non-printable characters', () => {
  it('should skip all non ASCII printable characters', () => {
    fixtures.nonPrintableASCIIcharacters.forEach((words) => {
      expect(filter(words), words).to.be.equal(false);
    });
  });

  it('should allow all non ASCII printable characters', () => {
    fixtures.printableASCIIcharacters.forEach((words) => {
      expect(filter(words), words).to.be.equal(true);
    });
  });
});
