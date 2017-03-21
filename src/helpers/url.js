import url from 'url';

const githubURL = 'https://github.com';

module.exports = {
  getWebtaskURL: req => url.format({
    protocol: req.headers['x-forwarded-proto'],
    host: req.headers.host,
    search: (url.parse(req.url).search || '').replace(/&?ack_report=./, ''),
    pathname: url.parse(req.url).pathname
  }),
  getPullRequestURL: (repo, prId) => `${githubURL}/${repo}/pull/${prId}`,
  getPullRequestURLFromJWT: data =>
    `${githubURL}/${data.owner}/${data.repo}/pull/${data.pullRequestId}`
};
