// import hb from 'handlebars';
const dataHelper = require('./helpers/data');
const tpl = require('./templates/default.hbs');
const pkg = require('./../../package.json');
const url = require('./../helpers/url');

module.exports = (data, rawOutput) => {
  if (rawOutput) return data;

  // Group by filter
  const issues = Object.assign({}, dataHelper.groupByFilter(data.issues));
  const params = {
    version: pkg.version,
    repo: {
      owner: data.owner,
      name: data.repo,
      url: url.getRepoURL(data.owner, data.repo)
    },
    pullRequest: {
      id: data.pullRequestId,
      url: url.getPullRequestURL(data.owner, data.repo, data.pullRequestId)
    }
  };

  return tpl(Object.assign(issues, params));
};
