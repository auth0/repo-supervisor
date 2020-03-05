const obfuscate = require(`${global.srcPath}/render/templates/helpers/obfuscate.js`);

describe('Render -> Obfuscate strings', () => {
  it('should obfuscate a string to not reveal its full content', () => {
    expect(obfuscate('this-is-a-string')).to.eql('this-is-********************');
    expect(obfuscate('1234567890')).to.eql('12345678********************');
    expect(obfuscate('')).to.eql('********************');
  });
});
