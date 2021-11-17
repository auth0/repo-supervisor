const Octokit = require('@octokit/rest').Octokit;
const Webhook = require('@octokit/webhooks-methods');

module.exports = (apiToken) => {
  const client = new Octokit({
    auth: `token ${apiToken}`,
    userAgent: 'Repo-Supervisor (Node.JS, https://github.com/auth0/repo-supervisor)',
    request: {
      timeout: 5000
    }
  });

  client.webhooks = Webhook;
  client.HTTP_SIGNATURE_HEADER = 'x-hub-signature-256';

  return client;
};
