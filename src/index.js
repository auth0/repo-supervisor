'use strict';

const assert = require('assert');
const config = require('../config/main.json');
const wh = require('./parser/webhook');

module.exports = (ctx, req, res) => {
  assert(ctx.data, 'Invalid request - missing query parameters.');
  assert(ctx.secrets, 'Secrets not set.');
  assert(ctx.secrets.GITHUB_TOKEN, 'GITHUB_TOKEN is not set.');
  assert(ctx.secrets.JWT_SECRET, 'JWT_SECRET is not set.');

  const respond = data => res.end(typeof data !== 'string' ? '' : data);
  const github = require('./lib/github')(ctx.secrets.GITHUB_TOKEN);
  const viewer = require('./viewer')(ctx.secrets.JWT_SECRET, github);

  if (ctx.data.id) {
    // Viewer request.
    return viewer.getReportContent(ctx.data.id).then(respond).catch(respond);
  }

  const repository = {
    name: ctx.data.repository.name,
    owner: ctx.data.repository.owner.login,
    pullRequestId: ctx.data.pull_request.number,
    pullRequestSHA: ctx.data.pull_request.head.sha
  };

  if (config.pullRequests.allowedActions.indexOf(ctx.data.action) > -1) {
    // Webhook trigger.
    const status = require('./helpers/status')(github, {
      repo: repository.name,
      user: repository.owner,
      sha: repository.pullRequestSHA
    });

    return wh.parse(
      github,
      repository.pullRequestId,
      repository.owner,
      repository.name,
      true
    ).then(data =>
      status.setPending('Checking for security issues...').then(() => {
        if (data.issues.length > 0) {
          return status.setError(
            'Security issues were detected.',
            viewer.getReportURL(repository.pullRequestId, repository.owner, repository.name)
          );
        }

        return status.setSuccess('Everything looks fine, no issues detected.');
      }).then(respond)
        .catch(err => status.setFailure(err.toString()).then(respond))
    ).catch(err => respond(err.toString()));
  }
};
