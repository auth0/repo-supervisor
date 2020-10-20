/* eslint-disable max-len */
// Issue: https://github.com/auth0/repo-supervisor/issues/65
const tokenizer = require(`${global.srcPath}/parser/tokenizer/json/index.js`);
const objectA = {
  a: 1,
  b: 'test',
  c: {
    aa: 2,
    bb: 'test2',
    cc: {
      aaa: 3,
      bbb: 'test3',
      ccc: {
        aaaa: 4,
        bbbb: 'test4',
        cccc: {},
        dddd: ['foobar', 44, {
          foobar4: 444,
          foobar__44: ['foobar_44']
        }]
      },
      ddd: ['foobar', 33, {
        foobar3: 333,
        foobar__33: ['foobar_33']
      }]
    },
    dd: ['foobar', 22, {
      foobar2: 222,
      foobar__22: ['foobar_22']
    }]
  },
  d: ['foobar', 1, {
    foobar1: 111,
    foobar__11: ['foobar_11']
  }]
};
const objectB = ['a', '1', 'b', 'test', 'c', 'aa', '2', 'bb', 'test2', 'cc', 'aaa', '3', 'bbb', 'test3', 'ccc', 'aaaa', '4', 'bbbb', 'test4', 'cccc', 'dddd', '0', 'foobar', '44', 'foobar4', '444', 'foobar__44', 'foobar_44', 'ddd', '33', 'foobar3', '333', 'foobar__33', 'foobar_33', 'dd', '22', 'foobar2', '222', 'foobar__22', 'foobar_22', 'd', 'foobar1', '111', 'foobar__11', 'foobar_11'];

function test() {
  it('[Issue #065] Should process nested JSON object and return all keys and values', () => {
    const config = { checkObjectKeys: true, checkObjectValues: true, maxAllowedDepth: 100 };
    const result = tokenizer(JSON.stringify(objectA), config);

    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(objectB));
  });

  it('[Issue #065] Should process nested JSON object with max allowed depth limit', () => {
    const fixtures = [
      {
        config: { checkObjectKeys: true, checkObjectValues: true, maxAllowedDepth: 1 },
        result: ['a', '1', 'b', 'test', 'c', 'd']
      },
      {
        config: { checkObjectKeys: true, checkObjectValues: true, maxAllowedDepth: 3 },
        result: ['a', '1', 'b', 'test', 'c', 'aa', '2', 'bb', 'test2', 'cc', 'aaa', '3', 'bbb', 'test3', 'ccc', 'ddd', 'dd', 'd', '0', 'foobar']
      },
      {
        config: { checkObjectKeys: true, checkObjectValues: true, maxAllowedDepth: 7 },
        result: ['a', '1', 'b', 'test', 'c', 'aa', '2', 'bb', 'test2', 'cc', 'aaa', '3', 'bbb', 'test3', 'ccc', 'aaaa', '4', 'bbbb', 'test4', 'cccc', 'dddd', '0', 'foobar', '44', 'foobar4', '444', 'foobar__44', 'ddd', '33', 'foobar3', '333', 'foobar__33', 'foobar_33', 'dd', '22', 'foobar2', '222', 'foobar__22', 'foobar_22', 'd', 'foobar1', '111', 'foobar__11', 'foobar_11']
      },
      {
        config: { checkObjectKeys: true, checkObjectValues: true, maxAllowedDepth: 8 },
        result: objectB
      },
      {
        config: { checkObjectKeys: true, checkObjectValues: true, maxAllowedDepth: 100 },
        result: objectB
      }
    ];

    fixtures.forEach((fixture) => {
      const result = tokenizer(JSON.stringify(objectA), fixture.config);
      expect(JSON.stringify(result)).to.be.equal(JSON.stringify(fixture.result), `Failed for the nested level of ${fixture.config.maxAllowedDepth}`);
    });
  });
}

module.exports = test;
