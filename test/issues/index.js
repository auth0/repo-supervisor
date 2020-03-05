const fs = require('fs');

const path = './test/issues';
const pattern = 'issue-[0-9]+\\.js';
const getIssues = (dir, regex) => {
  try {
    return fs.readdirSync(path).filter(file => file.match(new RegExp(regex, 'ig')));
  } catch (e) {
    return [];
  }
};

describe('Issues', () => getIssues(path, pattern).forEach(test => require(`./${test}`)()));
