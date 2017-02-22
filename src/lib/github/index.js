import Github from 'github';

module.exports = (apiToken) => {
  const client = new Github({
    version: 3,
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    timeout: 5000,
    headers: {
      'user-agent': 'node.js'
    },
    Promise: require('bluebird')
  });

  client.authenticate({
    type: 'token',
    token: apiToken
  });

  return client;
};
