const tokenizer = require(`${global.srcPath}/parser/tokenizer/json/index.js`);
const config = { checkObjectKeys: true, checkObjectValues: true };

// Issue: https://github.com/auth0/repo-supervisor/issues/7
function test() {
  it('[Issue #007] Should not fail on JSON with "toString" key', () => {
    const objectA = { builtin: { toString: true } };
    const objectB = ['builtin', '[object Object]'];
    const result = tokenizer(JSON.stringify(objectA), config);

    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(objectB));
  });
}

module.exports = test;
