const url = require('url');
const config = require('./../../config/main.json');

module.exports = {
  getEndpointURL: (event) => {
    if (!event.headers) return null;

    return url.format({
      protocol: event.headers['X-Forwarded-Proto'],
      host: event.headers.Host,
      pathname: event.path
    }).replace(/\/+$/g, '');
  },
  getRepoURL: (owner, repo) => `${config.githubUrl}/${owner}/${repo}`,
  getPullRequestURL: (owner, repo, prId) => `${config.githubUrl}/${owner}/${repo}/pull/${prId}`,
  getShortSlackURL: (link, text = 'show report') => `<${link}|${text}>`
};
