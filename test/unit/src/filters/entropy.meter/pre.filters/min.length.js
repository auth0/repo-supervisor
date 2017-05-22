const config = { minStringLength: 15 };
const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/min.length.js`);

describe('Pre filter -> Min length', () => {
  it('should allow string with the exact length as min. string length setting', () => {
    const str = 'a'.repeat(config.minStringLength);
    expect(filter(str, config), str).to.be.equal(true);
  });

  it('should skip string shorter than min. string length setting', () => {
    const str = 'a'.repeat(config.minStringLength - 1);
    expect(filter(str, config), str).to.be.equal(false);
  });

  it('should allow string longer than min. string length setting', () => {
    const str = 'a'.repeat(config.minStringLength + 1);
    expect(filter(str, config), str).to.be.equal(true);
  });
});
