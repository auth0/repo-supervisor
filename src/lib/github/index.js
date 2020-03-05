const Octokit = require('@octokit/rest').Octokit;

module.exports = (apiToken) => {
  const client = new Octokit({
    auth: `token ${apiToken}`,
    userAgent: 'Repo-Supervisor (Node.JS, https://github.com/auth0/repo-supervisor)',
    request: {
      timeout: 5000
    }
  });

  return client;
};
