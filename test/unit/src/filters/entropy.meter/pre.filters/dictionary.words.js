const filter = require(`${global.srcPath}/filters/entropy.meter/pre.filters/dictionary.words.js`);
const fixtures = global.getFixtures(__filename);

describe('Pre filter -> Dictionary words', () => {
  ['camelCase', 'separators', 'mixed', 'singleWords'].forEach(
    fixture => describe(fixture, () => fixtures[fixture].forEach(
        testCase => it(`should skip "${testCase}" because it contains real words`, () =>
          expect(filter(testCase), testCase).to.equal(false)
        )
      )
    )
  );

  it('should allow all strings that do not contain real words', () => {
    fixtures.notWords.forEach((words) => {
      expect(filter(words), words).to.be.equal(true);
    });
  });
});
