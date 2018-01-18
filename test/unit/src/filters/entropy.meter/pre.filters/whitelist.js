const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/whitelist.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Whitelist', () => {
  const config = {whitelist: fixtures.whitelist};

  describe(
    'String is in whitelist',
    () => fixtures.whitelist.forEach(
      testCase => it(`should skip "${testCase}"`, () =>
        expect(filter(testCase, config), testCase).to.be.false
      )
    )
  );

  describe(
    'String is not in whitelist',
    () => fixtures.shouldNotMatch.forEach(
      testCase => it(`should not skip "${testCase}"`, () =>
        expect(filter(testCase, config), testCase).to.be.true
      )
    )
  );
});
