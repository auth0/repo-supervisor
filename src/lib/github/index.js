import Github from 'github';

module.exports = (apiToken) => {
  const client = new Github({
    version: '3.0.0',
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    timeout: 5000,
    headers: {
      'user-agent': 'Repo-Supervisor (Node.JS, https://github.com/auth0/repo-supervisor)'
    },
    Promise: require('bluebird')
  });

  client.authenticate({
    type: 'token',
    token: apiToken
  });

  return client;
};
